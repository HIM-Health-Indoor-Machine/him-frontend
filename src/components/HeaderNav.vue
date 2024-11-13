<template>
  <header class="header">
    <div class="container">
      <div class="left-menu">
        <RouterLink :to="{ name: 'HomeView' }">
          <img class="logo-icon" src="@/assets/images/logo/logo.png" alt="Logo Icon" />
        </RouterLink>
        <RouterLink :to="{ name: 'HomeView' }" class="logo">HIM</RouterLink>
      </div>

      <div class="right-menu">
        <nav class="nav-links">
          <transition-group name="slide" tag="div" class="rolling-wrapper">
            <div v-for="(item, index) in [visibleItem]" :key="index" class="nav-link rolling-item">
              {{ item }}
            </div>
          </transition-group>
        </nav>

        <div class="tier-info">
          <img class="tier-icon" src="@/assets/images/tier/tier_IRON.png" alt="Tier Icon" />
          <span class="tier-text">IRON</span>
          <span class="tier-text">30000 EXP</span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: challengeProgress + '%' }"></div>
        </div>

        <b-navbar>
          <b-navbar-nav>
            <b-nav-item href="#" @click="toggleProfileMenu" class="profile-button">
              <img src="@/assets/images/character/example.jpg" alt="Profile" class="profile-image">
              <RouterLink :to="{ name: 'HomeView' }" class="menu-item">홈 화면으로 가기</RouterLink>
              <RouterLink class="menu-item">로그아웃</RouterLink>
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const isProfileMenuOpen = ref(false);
const currentIndex = ref(0);
const items = ["승급 필요 경험치 700exp", "오늘 경험치 20exp"];

const visibleItem = computed(() => items[currentIndex.value]);

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const startRolling = () => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.length;
  }, 2000);
};

onMounted(startRolling);
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 7px 0;
  z-index: 100;
}

.container {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-menu {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #202a37;
  text-decoration: none;
}

.logo-icon {
  width: 60px;
  margin-right: 8px;
}

.nav-links {
  display: flex;
  align-items: center;
  margin-left: 24px;
}

.rolling-item {
  color: #cb5b39;
  font-size: 1.2rem;
  padding: 5px 10px;
  white-space: nowrap;
}

.rolling-item:hover {
  color: #d8854e;
}

@keyframes rollUp {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes rollDown {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}

.slide-enter-active {
  animation: rollUp 0.8s ease forwards;
}

.slide-leave-active {
  animation: rollDown 0.8s ease forwards;
}

.right-menu {
  display: flex;
  align-items: center;
}

.tier-info {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.tier-icon {
  width: 40px;
  color: #4b5563;
}

.tier-text {
  margin-left: 10px;
  color: #374151;
  font-size: 1.3rem;
  font-weight: bold;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  background: none;
  border: none;
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.progress-bar {
  width: 120px;
  height: 14px;
  background-color: #cfcfcf;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 16px;
}

.progress-fill {
  height: 100%;
  background-color: #ff7043;
  animation: fillProgress 1s forwards;
}

.menu-item {
  display: block;
  padding: 12px 16px;
  font-size: 1.1rem;
  color: #374151;
  text-decoration: none;
}
</style>
