import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import StreamerDashboardView from './views/StreamerDashboardView.vue';
import AdminQuestionBankView from './views/AdminQuestionBankView.vue';
import GameShowView from './views/GameShowView.vue';
import TugDashboardView from './views/TugDashboardView.vue';
import TugOverlayView from './views/TugOverlayView.vue';
import CatchwordDashboardView from './views/CatchwordDashboardView.vue';
import CatchwordOverlayView from './views/CatchwordOverlayView.vue';
import CrosswordDashboardView from './views/CrosswordDashboardView.vue';
import CrosswordOverlayView from './views/CrosswordOverlayView.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
    // Game 2: Kéo Co Tri Thức
    {
      path: '/tug/dashboard',
      name: 'tug-dashboard',
      component: TugDashboardView,
    },
    {
      path: '/tug/:roomCode?',
      name: 'tug-overlay',
      component: TugOverlayView,
    },
    // Game 3: Đuổi Hình Bắt Chữ
    {
      path: '/catchword/dashboard',
      name: 'catchword-dashboard',
      component: CatchwordDashboardView,
    },
    {
      path: '/catchword/:roomCode?',
      name: 'catchword-overlay',
      component: CatchwordOverlayView,
    },
    // Game 4: Giải Mã Ô Chữ (Crossword Battle)
    {
      path: '/crossword/dashboard',
      name: 'crossword-dashboard',
      component: CrosswordDashboardView,
    },
    {
      path: '/crossword/:roomCode?',
      name: 'crossword-overlay',
      component: CrosswordOverlayView,
    },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
