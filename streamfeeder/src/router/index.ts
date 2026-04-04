import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/l1', name:'l1', component: () => import('../views/ListDav1.vue'), },
    { path: '/developer', name:'dev', component: () => import('../views/DeveloperView.vue'), },
  ],
})

export default router
