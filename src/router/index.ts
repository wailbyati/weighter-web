import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import SignUp from '@/views/SignUp.vue'
import LogIn from '@/views/LogIn.vue'
import ConfirmEmail from '@/views/ConfirmEmail.vue'
import ResendConfirmationEmail from '@/views/ResendConfirmationEmail.vue'
import AccountSettings from '@/views/AccountSettings.vue'
import User from '@/views/User.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home,
    name: 'home'
  },
  {
    path: '/sign-up',
    component: SignUp,
    name: 'sign-up'
  },
  {
    path: '/log-in',
    component: LogIn,
    name: 'log-in'
  },
  {
    path: '/confirm-email',
    component: ConfirmEmail,
    name: 'confirm-email'
  },
  {
    path: '/resend-confirmation-email',
    component: ResendConfirmationEmail,
    name: 'resend-confirmation-email'
  },
  {
    path: '/account-settings',
    component: AccountSettings,
    name: 'account-settings'
  },
  {
    path: '/user/:userId',
    component: User,
    name: 'user'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
