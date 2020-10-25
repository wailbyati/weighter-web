import '@/classcomponenthooks'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import {
  extend,
  localize,
  ValidationProvider,
  ValidationObserver
} from 'vee-validate'
import {
  required,
  email,
  min,
  max,
  // eslint-disable-next-line @typescript-eslint/camelcase
  min_value,
  // eslint-disable-next-line @typescript-eslint/camelcase
  max_value
} from 'vee-validate/dist/rules'
import pl from 'vee-validate/dist/locale/pl.json'

Vue.config.productionTip = false

extend('required', required)
extend('email', email)
extend('min', min)
extend('max', max)
extend('min_value', min_value)
extend('max_value', max_value)
localize('pl', pl)
Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
