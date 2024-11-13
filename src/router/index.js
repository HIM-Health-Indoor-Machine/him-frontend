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
import ChallengePlayView from '@/views/ChallengePlayView.vue';
import StartView from '@/views/StartView.vue';

const routes = [
  {
    // path: '/',
    path: '/home-view',
  {
    path: '/',
    name: 'StartView',
    component: StartView,
  },
  {
    path: '/home-view',                              
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/loading-screen',
    name: 'LoadingScreen',
    component: LoadingScreen,
  },
  {
    path: '/challenge-select-view',
    name: 'ChallengeSelectView',
    component: ChallengeSelectView,
  },
  {
    path: '/fail-screen',
    name: 'FailScreen',
    component: FailScreen,
  },
  {
    path: '/success-screen',
    name: 'SuccessScreen',
    component: SuccessScreen,
  },
  {
    path: '/game-select-view',
    name: 'GameSelectView',
    component: GameSelectView,
  },
  {
    path: '/login-view',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/sign-up-view',
    name: 'SignUpView',
    component: SignUpView,
  },
  {
    path: '/game-play-view',
    name: 'GamePlayView',
    component: GamePlayView,
  },
  {
    path: '/challenge-play-view',
    name: 'ChallengePlayView',
    component: ChallengePlayView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
