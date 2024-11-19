<template>
  <div class="back-rectangle"></div>
  <div class="nav-bar">
    <div class="nav-button">
      <div class="left-menu">
        <RouterLink :to="{ name: 'HomeView' }">
          <img class="logo-icon" src="@/assets/images/logo/logo.png" alt="Logo Icon" />
        </RouterLink>
        <div class="logo">HIM</div>
      </div>
    </div>

    <nav class="nav-links">
      <img src="@/assets/images/icon/heart-icon.png" alt="설명 아이콘" class="heart-icon" />
      <transition-group name="slide" tag="div">
        <div v-for="(item, index) in [visibleItem]" :key="index + '-' + item" class="nav-link rolling-item">
          {{ item }}
        </div>
      </transition-group>
    </nav>

    <div class="right-menu">
      <div class="tier-info">
        <div class="tier-container">
          <img class="tier-icon" :src="user.curTierIcon" alt="Tier Icon" />
          <div class="tier-text">{{ user.tier }}</div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: expFilledBarWidth + '%' }"></div>
          <div class="exp-text">{{ user.exp }} / {{ user.maxExp }} exp</div>
        </div>
      </div>
    </div>

    <div>
      <div class="profile-button">
        <img :src=user.profileImg alt="Profile" class="profile-image">
        <div class="nickname">{{ user.nickname }}</div>
        <RouterLink :to="{ name: 'StartView' }" class="logout-item">로그아웃</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useAchievedExp } from "@/composables/useAchievedExp";
import { useTodayChallengeStore } from '@/stores/todayChallenge';
import { useGameStore } from '@/stores/game';

const todayChallengeStore = useTodayChallengeStore();
const userStore = useUserStore();
const gameStore = useGameStore();

const { todayChallenges } = storeToRefs(todayChallengeStore);
const { games } = storeToRefs(gameStore);
const { userId } = storeToRefs(userStore);
const { user } = storeToRefs(userStore);

const expByDifficulty = { "EASY": 5, "MEDIUM": 10, "HARD": 20 };

const { totalAchievedExp } = useAchievedExp(games, expByDifficulty, todayChallenges);
const { achievedChallengeCount } = useAchievedExp(games, expByDifficulty, todayChallenges);

const currentIndex = ref(0);
const items = computed(() => [
      "승급 필요 경험치 " + (user.value.maxExp - user.value.exp) + " exp",
      "오늘 경험치 " + (totalAchievedExp.value + achievedChallengeCount.value * 5) + " exp",
      "챌린지 성공 시, +5 exp",
      "Easy 성공 시, +" + expByDifficulty.EASY + " exp",
      "Medium 성공 시, +" + expByDifficulty.MEDIUM + " exp",
      "Hard 성공 시, +" + expByDifficulty.HARD + " exp",
      "운동 안할 시, -113 exp",
    ]);

const expValue = ref(0)
const expFilledBarWidth = ref(0);
const visibleItem = computed(() => items.value[currentIndex.value]);

const increaseExp = () => {
  let interval = setInterval(() => {
    if (expValue.value < user.value.exp) {
      expValue.value += 10;
    } else {
      clearInterval(interval);
    }
  }, 10);
};

watch(expValue, (newVal) => {
  expFilledBarWidth.value = (newVal / user.value.maxExp) * 100;
});

const startRolling = () => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length;
  }, 2000);
};

onMounted(async() => {
  await userStore.fetchUserInfo(userId.value);
  await todayChallengeStore.fetchTodayChallengeList(userId.value, new Date().toISOString().split("T")[0]);
  await gameStore.fetchGameList(userId.value, new Date().toISOString().split("T")[0]);
  startRolling();
  increaseExp();
});
</script>

<style scoped>
.back-rectangle {
  position: fixed;
  top: 18px;
  left: 28px;
  width: 98vw;
  height: 9vh;
  background: #81c784;
  border: 2px solid #000080;
  border-radius: 10px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 5px;
  left: 15px;
  width: 98vw;
  height: 9vh;
  background: #a5d6a7;
  border: 2px solid #000080;
  border-radius: 10px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

.nav-button {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #FFFFFF, #CCCCCC);
  border-right: 2px solid #000080;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.left-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: #2cca95;
  text-decoration: none;
  -webkit-text-stroke: 1.5px #000;
}

.logo-icon {
  width: 100px;
}

.container {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 20%;
  flex-wrap: wrap;
}

.rolling-item {
  color: #cb5b39;
  font-size: 1.5rem;
  padding: 5px 10px;
  max-width: 300px;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-all;
  margin: 5px;
}

@keyframes moveUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(-60%);
    opacity: 1;
  }
}

@keyframes moveOut {
  0% {
    transform: translateY(55%);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.slide-enter-active {
  animation: moveUp 0.8s ease forwards;
}

.slide-leave-active {
  animation: moveOut 0.8s ease forwards;
}

.right-menu {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tier-info {
  display: flex;
  align-items: center;
  margin-right: 16px;
  gap: 10px;
}

.tier-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tier-icon {
  width: 43px;
  color: #4b5563;
}

.tier-text {
  color: #374151;
  font-size: 1.3rem;
  font-weight: bold;
}

.exp-bar-container {
  width: 20vw;
  height: 3.5vh;
  background: #e0e0e0;
  border-radius: 10px;
  margin: 0 auto;
  position: relative;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f39c12, #e67e22);
  border-radius: 10px;
}

.exp-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.8),
    0 0 16px rgba(255, 255, 255, 0.6),
    0 0 24px rgba(255, 255, 255, 0.4);
  margin-top: 20px;
  animation: pulseGlow 2s ease-in-out infinite;
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  background: linear-gradient(to right, #A8FF78, #4CAF50, #1B5E20);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.exp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  font-weight: bold;
  color: #660000;
  font-size: 1.2rem;
  width: 100%;
  text-align: center;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: none;
  border: none;
}

.profile-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
}

.nickname {
  font-size: 1.5rem;
  color: #ff7043;
  text-decoration: none;
  -webkit-text-stroke: 0.5px #000;
}

.logout-item {
  display: block;
  padding: 12px 16px;
  font-size: 1.1rem;
  color: #374151;
  text-decoration: none;
  margin-left: 15px;
}

.logo-icon,
.logout-item {
  display: inline-block;
  transition: transform 0.1s ease-in-out, background-color 0.2s;
  cursor: pointer;
}

.logo-icon:hover,
.logout-item:hover {
  transform: scale(1.3);
  border-radius: 5px;
}
</style>