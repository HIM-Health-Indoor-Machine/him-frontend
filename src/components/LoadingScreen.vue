<template>
    <div class="loading-screen" v-if="isLoading">
        <!-- 로딩 텍스트 -->
        <div class="loading-text">Loading...</div>

        <!-- 로딩 바 -->
        <div class="loading-bar-container">
            <div class="loading-bar-fill" :style="{ width: progressWidth + '%' }"></div>
            <div class="loading-percent">{{ progress }}%</div>
        </div>

        <div class="character-container">
            <div v-for="(char, index) in characters" :key="index" class="character"
                :style="{ left: char.x + '%', bottom: char.y + '%' }">
                {{ char.icon }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const progress = ref(0);
const characters = ref([
    { icon: '🐱', x: 10, y: 0 },
    { icon: '🐶', x: 30, y: 0 },
    { icon: '🐰', x: 50, y: 0 },
    { icon: '🦊', x: 70, y: 0 },
    { icon: '🐻', x: 90, y: 0 }
]);

const progressWidth = ref(0);

// 로딩 진행 및 캐릭터 점프 애니메이션
const updateLoading = () => {
    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 1;
            progressWidth.value = progress.value;

            characters.value.forEach((char, index) => {
                char.y = Math.random() * 20 + 10;
            });
        } else {
            clearInterval(interval);
            isLoading.value = false;
        }
    }, 50);
};

onMounted(() => {
    updateLoading();
});

</script>

<style>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #e6f7ff, #ccf2ff);
    color: #333;
    font-family: 'Comic Neue', sans-serif;
}

.loading-text {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #4CAF50;
    animation: bounceText 1.5s ease-in-out infinite;
}

@keyframes bounceText {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.loading-bar-container {
    position: relative;
    width: 80%;
    height: 25px;
    background-color: #e0e0e0;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 30px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.loading-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #76c7c0, #4CAF50);
    border-radius: 15px 0 0 15px;
    transition: width 0.3s ease;
}

.loading-percent {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    color: white;
}

.character-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.character {
    font-size: 2.5rem;
    position: absolute;
    bottom: 0;
    transition: all 0.3s ease;
    animation: jump 1s ease-in-out infinite;
}

@keyframes jump {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}
</style>
