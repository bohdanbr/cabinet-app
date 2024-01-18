import { createRouter, createWebHashHistory } from 'vue-router';
import Login from './pages/Login.vue'
import Cabinet from './pages/Cabinet.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Login', component: Login },
    { path: '/cabinet', name: 'Cabinet', component: Cabinet },
  ],
});

export default router;