
import { createRouter, createWebHistory } from 'vue-router'
import AccountsPage from '../pages/AccountsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AccountsPage',
      component: () => import('../pages/AccountsPage.vue'),
    },
  ],
})

export default router

