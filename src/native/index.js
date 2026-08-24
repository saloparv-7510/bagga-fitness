/* ==========================================================================
   Native bridge — the only file in the app that talks to Capacitor.
   Everything here is a no-op in a normal browser, so `npm run dev:app`
   renders the exact same app shell on the desktop for development.

   Nothing else in src/ imports @capacitor/*. Keep it that way: this module is
   reached only through the dynamic imports in main.jsx and AppShell, which is
   what keeps the plugins out of the website's entry chunk and stops the site
   ever fetching them. (Rollup still code-splits them into dist/ — see the note
   in main.jsx — they are just never requested there.)
   ========================================================================== */

import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Keyboard } from '@capacitor/keyboard'
import { AppLauncher } from '@capacitor/app-launcher'

export const isNative = () => {
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

export const platform = () => {
  try {
    return Capacitor.getPlatform()
  } catch {
    return 'web'
  }
}

/* Plugin calls must never take the UI down with them. A missing plugin, an
   OEM that refuses a haptic, a WebView with no status bar — all of it is
   cosmetic, so swallow it and carry on. */
const attempt = async (fn) => {
  try {
    return await fn()
  } catch {
    return undefined
  }
}

/* ---------------------------------------------------------------- chrome --- */

/* Dark status bar with light icons, matching --ink-950. */
export const initStatusBar = () =>
  attempt(async () => {
    if (!isNative()) return
    await StatusBar.setStyle({ style: Style.Dark })
    if (platform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#04050a' })
      await StatusBar.setOverlaysWebView({ overlay: false })
    }
  })

/* Held open by launchAutoHide:false in capacitor.config.json until React has
   painted, so the user never sees an unstyled frame. */
export const hideSplash = () => attempt(() => isNative() && SplashScreen.hide({ fadeOutDuration: 220 }))

/* --------------------------------------------------------------- haptics --- */

let hapticsOk = true
export const tapFeedback = () => {
  if (!isNative() || !hapticsOk) return
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {
    // One refusal means this device/OEM will refuse every time. Stop asking.
    hapticsOk = false
  })
}

/* -------------------------------------------------------------- keyboard --- */

/* capacitor.config.json sets Keyboard.resize = "none", so the WebView keeps its
   full height when the keyboard opens. That keeps the layout from reflowing
   (and the fixed tab bar from being shoved upward), but it means we have to
   deal with the covered area ourselves:
     --kb          the keyboard height, for bottom padding
     data-kb="1"   hides the tab bar while typing
   Then scroll the focused field into view, because a viewport that never
   changed size will not do it for us. */
export const initKeyboard = () =>
  attempt(() => {
    if (!isNative()) return
    const root = document.documentElement

    Keyboard.addListener('keyboardWillShow', (info) => {
      root.style.setProperty('--kb', `${info.keyboardHeight}px`)
      root.dataset.kb = '1'
    })

    Keyboard.addListener('keyboardDidShow', () => {
      const el = document.activeElement
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    })

    const reset = () => {
      root.style.setProperty('--kb', '0px')
      delete root.dataset.kb
    }
    Keyboard.addListener('keyboardWillHide', reset)

    if (platform() === 'android') attempt(() => Keyboard.setAccessoryBarVisible({ isVisible: false }))
  })

/* ------------------------------------------------------- external links --- */

/* Hands the URL to the OS so tel: dials, mailto: composes, wa.me opens the
   WhatsApp app and a maps URL opens Google Maps — instead of all of them
   loading inside our own WebView, which would strand the user in the app with
   no way back. */
export const openExternal = (url) => {
  if (!url) return
  if (!isNative()) {
    window.open(url, '_blank', 'noopener')
    return
  }
  AppLauncher.openUrl({ url }).catch(() => {
    // Last resort: let the WebView try. Better than a dead tap.
    window.open(url, '_blank', 'noopener')
  })
}

const isExternalHref = (href) =>
  !!href && /^(https?:|tel:|mailto:|sms:|whatsapp:|geo:|intent:)/i.test(href)

/* The site was written for a browser: eight components use
   <a target="_blank"> or window.open(). Rather than edit every one of them
   (and risk the web build regressing), intercept both here. */
const initLinkHandling = () => {
  if (!isNative()) return

  document.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!a) return
      const href = a.getAttribute('href')
      if (!isExternalHref(href)) return // in-page #anchors stay in the WebView
      e.preventDefault()
      openExternal(a.href)
    },
    true
  )

  const nativeOpen = window.open.bind(window)
  window.open = (url, ...rest) => {
    if (isExternalHref(String(url || ''))) {
      openExternal(String(url))
      return null
    }
    return nativeOpen(url, ...rest)
  }
}

/* ----------------------------------------------------------- back button --- */

/* Android's hardware/gesture back, resolved in the order a user expects:
     1. an open modal or lightbox closes
     2. a sub-tab returns to its first screen
     3. a tab returns Home
     4. Home exits — but only on a second press inside 2s
   Step 1 needs no cooperation from the components: both overlays already
   close on Escape, so we hand them a synthetic Escape and consume the press. */
const closeTopOverlay = () => {
  const dialog = document.querySelector('[role="dialog"][aria-modal="true"]')
  if (!dialog) return false
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  return true
}

export const initBackButton = (onBack) =>
  attempt(() => {
    if (!isNative()) return
    let armed = false
    let timer = null

    CapApp.addListener('backButton', () => {
      if (closeTopOverlay()) return

      if (document.documentElement.dataset.kb === '1') {
        attempt(() => Keyboard.hide())
        return
      }

      if (onBack && onBack() === true) {
        armed = false
        clearTimeout(timer)
        return
      }

      // Already at the root. Confirm before killing the app.
      if (armed) {
        CapApp.exitApp()
        return
      }
      armed = true
      showToast('Press back again to exit')
      clearTimeout(timer)
      timer = setTimeout(() => {
        armed = false
      }, 2000)
    })
  })

/* --------------------------------------------------------------- toast --- */

/* A 20-line toast beats a plugin here: it is styled like the rest of the app,
   costs nothing, and is only ever used for the exit confirmation. */
let toastEl = null
let toastTimer = null
export const showToast = (message, ms = 1900) => {
  if (!toastEl) {
    toastEl = document.createElement('div')
    toastEl.className = 'app-toast'
    toastEl.setAttribute('role', 'status')
    toastEl.setAttribute('aria-live', 'polite')
    document.body.appendChild(toastEl)
  }
  toastEl.textContent = message
  // Force a reflow so the class re-triggers when a toast is already showing.
  toastEl.classList.remove('is-in')
  void toastEl.offsetWidth
  toastEl.classList.add('is-in')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toastEl.classList.remove('is-in'), ms)
}

/* ----------------------------------------------------------------- init --- */

/* Called once from AppShell on mount. `onBack` returns true when it handled
   the press itself. Guarded because React StrictMode runs mount effects twice
   in development, and registering two back-button listeners would make one
   press navigate two steps. */
let initialised = false
export const initNative = ({ onBack } = {}) => {
  if (initialised) return
  initialised = true
  initLinkHandling()
  initStatusBar()
  initKeyboard()
  initBackButton(onBack)
}
