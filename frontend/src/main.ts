import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import StreamerDashboardView from './views/StreamerDashboardView.vue';
import AdminQuestionBankView from './views/AdminQuestionBankView.vue';
import GameShowView from './views/GameShowView.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: StreamerDashboardView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminQuestionBankView,
    },
    {
      path: '/game/:roomCode?',
      name: 'gameshow',
      component: GameShowView,
    },
    {
      path: '/room/:roomCode?',
      name: 'room-alias',
      component: GameShowView,
    },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

