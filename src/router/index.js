import { createRouter, createWebHistory } from 'vue-router';
import StartView from '@/views/StartView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import HomeView from '@/views/HomeView.vue';
import GameSelectView from '@/views/GameSelectView.vue';
import ChallengeSelectView from '@/views/ChallengeSelectView.vue';
import ChallengePlayView from '@/views/ChallengePlayView.vue';
import ChallengeSuccessScreen from '@/components/ChallengeSuccessScreen.vue';
import SuccessScreen from '@/components/SuccessScreen.vue';
import FailScreen from '@/components/FailScreen.vue';
import GamePlayView from '@/views/GamePlayView.vue';

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
    path: '/signup-view',
    name: 'SignUpView',
    component: SignUpView,
  },
  {
    path: '/home-view/:userId',                              
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/game-select-view/:userId',
    name: 'GameSelectView',
    component: GameSelectView,
  },
  {
    path: '/game-play-view/:id/:type/:difficultyLevel/:theme/:userId',
    name: 'GamePlayView',
    component: GamePlayView,
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
    path: '/success-screen/:id/:type/:difficultyLevel/:userId/:prevTier/:expPoints',
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
