import { createRouter, createWebHistory } from 'vue-router';
import Code from '../views/code/index.vue';
import FileRelative from '../views/file-relative/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/graph'
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/file-relative/index.vue')
    },
    {
      path: '/code',
      name: 'code',
      component: () => import('../views/code/index.vue')
    }
  ]
})

export default router
