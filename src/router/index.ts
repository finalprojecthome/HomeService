import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import UI from '../pages/UI.vue'
import ServiceList from '../pages/ServiceList.vue'

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
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceList
    }
  ]
})

export default router
