import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import HomeView from '@/views/HomeView.vue';
import ChallengeSelectView from '@/views/ChallengeSelectView.vue';
import GameSelectView from '@/views/GameSelectView.vue';
import FailScreen from '@/components/FailScreen.vue';
import SuccessScreen from '@/components/SuccessScreen.vue';
import ChallengePlayView from '@/views/ChallengePlayView.vue';
import StartView from '@/views/StartView.vue';
import GamePlayViewDuck from '@/views/GamePlayViewDuck.vue';
import GamePlayViewBomb from '@/views/GamePlayViewBomb.vue';
import GamePlayViewFlying from '@/views/GamePlayViewFlying.vue';

const routes = [
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
    path: '/game-select-view',
    name: 'GameSelectView',
    component: GameSelectView,
  },
  {
    path: '/game-play-view-flying',
    name: 'GamePlayViewFlying',
    component: GamePlayViewFlying,
  },
  {
    path: '/game-play-view-bomb',
    name: 'GamePlayViewBomb',
    component: GamePlayViewBomb,
  },
  {
    path: '/game-play-view-duck',
    name: 'GamePlayViewDuck',
    component: GamePlayViewDuck,
  },
  {
    path: '/challenge-select-view',
    name: 'ChallengeSelectView',
    component: ChallengeSelectView,
  },
  {
    path: '/challenge-play-view/:challengeId',
    name: 'ChallengePlayView',
    component: ChallengePlayView,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
