import { createRouter, createWebHistory } from 'vue-router';
import StartView from '@/views/StartView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import HomeView from '@/views/HomeView.vue';
import GameSelectView from '@/views/GameSelectView.vue';
import GamePlayViewDuck from '@/views/GamePlayViewDuck.vue';
import GamePlayViewBomb from '@/views/GamePlayViewBomb.vue';
import GamePlayViewFlying from '@/views/GamePlayViewFlying.vue';
import ChallengeSelectView from '@/views/ChallengeSelectView.vue';
import ChallengePlayView from '@/views/ChallengePlayView.vue';
import ChallengeSuccessScreen from '@/components/ChallengeSuccessScreen.vue';
import SuccessScreen from '@/components/SuccessScreen.vue';
import FailScreen from '@/components/FailScreen.vue';

const routes = [
  {
    path: '/',
    name: 'StartView',
    component: StartView,
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
    path: '/home-view',                              
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/game-select-view/:userId',
    name: 'GameSelectView',
    component: GameSelectView,
  },
  {
    path: '/game-play-view-flying/:id/:type/:difficultyLevel/:theme/:userId',
    name: 'GamePlayViewFlying',
    component: GamePlayViewFlying,
  },
  {
    path: '/game-play-view-bomb/:id/:type/:difficultyLevel/:theme/:userId',
    name: 'GamePlayViewBomb',
    component: GamePlayViewBomb,
  },
  {
    path: '/game-play-view-duck/:id/:type/:difficultyLevel/:theme/:userId',
    name: 'GamePlayViewDuck',
    component: GamePlayViewDuck,
  },
  {
    path: '/challenge-select-view/:userId',
    name: 'ChallengeSelectView',
    component: ChallengeSelectView,
  },
  {
    path: '/challenge-play-view/:challengeId/:userId',
    name: 'ChallengePlayView',
    component: ChallengePlayView,
  },
  {
    path: '/fail-screen/:id/:type/:difficultyLevel/:theme/:userId',
    name: 'FailScreen',
    component: FailScreen,
  },
  {
    path: '/success-screen/:userId/:prevTier/:expPoints',
    name: 'SuccessScreen',
    component: SuccessScreen,
  },
  {
    path: '/challenge-success-screen/:id/:userId/:prevTier/:prevExp',
    name: 'ChallengeSuccessScreen',
    component: ChallengeSuccessScreen, 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
