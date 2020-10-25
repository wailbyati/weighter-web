import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import colors from 'vuetify/lib/util/colors'
import pl from 'vuetify/src/locale/pl'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { pl },
    current: 'pl'
  },
  theme: {
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    themes: {
      light: {
        primary: colors.indigo.base,
        secondary: colors.deepPurple.base,
        accent: colors.lime.base
      },
      dark: {
        primary: colors.indigo.base,
        secondary: colors.deepPurple.base,
        accent: colors.lime.base
      }
    }
  }
})
