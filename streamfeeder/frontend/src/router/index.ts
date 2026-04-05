import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FolderView from '../views/FolderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/browse/:path', name:'browse', props: true, component: FolderView, },
    { path: '/developer', name:'dev', component: () => import('../views/DeveloperView.vue'), },
  ],
})

export default router
