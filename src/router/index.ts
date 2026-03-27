import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import UI from '../pages/UI.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/ui',
      name: 'ui',
      component: UI
    }
  ]
})

export default router
