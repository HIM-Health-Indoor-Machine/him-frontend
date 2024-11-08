// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import MyPageView from '@/views/MyPageView.vue';
import ChallengeSelectView from '@/views/ChallengeSelectView.vue';
import GameSelectView from '@/views/GameSelectView.vue';
import GamePlayView from '@/views/GamePlayView.vue';

import LoadingScreen from '@/components/LoadingScreen.vue';
import ModeSelect from '@/components/ModeSelect.vue';
import FailScreen from '@/components/FailScreen.vue';
import SuccessScreen from '@/components/SuccessScreen.vue';

const routes = [
  {
    // path: '/',
    path: '/my-page-view',
    name: 'MyPageView',
    component: MyPageView,
  },
  {
    // path: '/',
    path: '/loading-screen',
    name: 'LoadingScreen',
    component: LoadingScreen,
  },
  {
    // path: '/',
    path: '/challenge-select-view',
    name: 'ChallengeSelectView',
    component: ChallengeSelectView,
  },
  {
    // path: '/',
    path: '/mode-select',
    name: 'ModeSelect',
    component: ModeSelect,
  },
  {
    // path: '/',
    path: '/fail-screen',
    name: 'FailScreen',
    component: FailScreen,
  },
  {
    // path: '/',
    path: '/success-screen',
    name: 'SuccessScreen',
    component: SuccessScreen,
  },
  {
    // path: '/',
    path: '/game-select-view',
    name: 'GameSelectView',
    component: GameSelectView,
  },
  {
    // path: '/',
    path: '/login-view',
    name: 'LoginView',
    component: LoginView,
  },
  {
    // path: '/',
    path: '/sign-up-view',
    name: 'SignUpView',
    component: SignUpView,
  },
  {
    // path: '/',
    path: '/game-play-view',
    name: 'GamePlayView',
    component: GamePlayView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
