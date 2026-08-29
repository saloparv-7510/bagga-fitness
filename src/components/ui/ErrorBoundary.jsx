import React from 'react'
import { AlertTriangle, MessageCircle, Phone } from 'lucide-react'
import { gym, waLink } from '../../data/site.js'
import { LanguageContext } from '../../i18n/context.js'

/* One broken section must not blank the whole page. This site exists to get
   people to call or message the gym, so every section is wrapped on its own and
   the fallback keeps a working way to reach us.

   `id` is re-used on the fallback element so nav links and the scroll-spy still
   resolve to something when a section goes down.
   `quiet` renders nothing at all — used for chrome (navbar, footer) where a
   panel in place of the real thing would be more confusing than helpful. */
export default class ErrorBoundary extends React.Component {
  /* A class component reaches the language context through contextType rather
     than a hook. The context ships an English-identity `t` as its default, so
     the fallback still renders correctly even if a boundary somehow mounts
     outside the provider. */
  static contextType = LanguageContext

  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    // Surfaced in the console rather than swallowed, so it is diagnosable.
    console.error(`[BAGGA FITNESS] "${this.props.name || 'section'}" failed to render`, error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children
    if (this.props.quiet) return null

    const t = this.context.t
    const helpMessage = t(
      'Hello BAGGA FITNESS, part of your website did not load for me. Could you send me the details directly?'
    )
    const target = this.props.name ? t('the {name}', { name: this.props.name }) : t('this')

    return (
      <section id={this.props.id} className="shell py-14">
        <div className="card plate-edge flex flex-col items-start gap-3 p-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-silver-100">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rage-400" />
            {t('This section could not be displayed')}
          </span>
          <p className="text-sm leading-relaxed text-silver-400">
            {t(
              'The rest of the page still works. If you need {target} right now, message or call us and we will help you directly.',
              { target }
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={waLink(helpMessage)} target="_blank" rel="noopener" className="btn-titan">
              <MessageCircle className="h-4 w-4" /> {t('WhatsApp us')}
            </a>
            <a href={gym.phoneHref} className="btn-ghost">
              <Phone className="h-4 w-4" /> {gym.phone}
            </a>
          </div>
        </div>
      </section>
    )
  }
}
