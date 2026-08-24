import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/* Two targets out of one source tree.

     web  ->  dist       hosted site, broad browser support
     app  ->  dist-app   loaded from file:// inside the Capacitor WebView
                         (webDir in capacitor.config.json points here)

   Kept in separate directories on purpose: `cap sync` copies webDir verbatim
   into the native project, so the app build must never overwrite the site
   build — or a deploy would ship the tab-bar shell to the web.

   VITE_TARGET comes from .env.app, which Vite loads for `--mode app`. It is
   read here as well so the output directory follows the shell automatically.
*/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isApp = env.VITE_TARGET === 'app'

  return {
    base: './',
    plugins: [react()],
    server: { port: isApp ? 5181 : 5180, host: true },
    build: {
      outDir: isApp ? 'dist-app' : 'dist',
      // Android WebView ships with Chrome; iOS with modern Safari. Neither
      // needs the es2019 floor the public site keeps for older desktops.
      target: isApp ? 'es2020' : 'es2019',
      cssCodeSplit: false,
      // Nothing debugs the WebView bundle from a browser devtools window, and
      // the maps would be copied into the APK.
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  }
})
