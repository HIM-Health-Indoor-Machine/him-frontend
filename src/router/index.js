// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import HomeView from '@/views/HomeView.vue';
import ChallengeSelectView from '@/views/ChallengeSelectView.vue';
import GameSelectView from '@/views/GameSelectView.vue';
import GamePlayView from '@/views/GamePlayView.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import FailScreen from '@/components/FailScreen.vue';
import SuccessScreen from '@/components/SuccessScreen.vue';

const routes = [

  {
    // path: '/',
    path: '/home-view',
    name: 'HomeView',
    component: HomeView,
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
