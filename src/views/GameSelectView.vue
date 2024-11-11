<template>
    <div>
        <div class="main-container">
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="sparkle"></div>

            <div class="header">Choose Your Workout!</div>

            <!-- 운동 타입 선택 -->
            <div class="option-container">
                <div class="option-card square" @click="selectType('Push Up')"
                    :class="{ selected: selectedType === 'Push Up' }">
                    <div class="option-icon">💪</div>
                    <div class="choice-label">Push Up</div>
                </div>
                <div class="option-card square" @click="selectType('Squat')"
                    :class="{ selected: selectedType === 'Squat' }">
                    <div class="option-icon">🏋️‍♂️</div>
                    <div class="choice-label">Squat</div>
                </div>
            </div>

            <!-- 난이도 선택 -->
            <div class="option-container">
                <div class="option-card cloud" @click="selectLevel('EASY')"
                    :class="{ selected: selectedLevel === 'EASY' }">
                    <div class="option-icon">🐥</div>
                    <div class="choice-label">EASY</div>
                </div>
                <div class="option-card cloud" @click="selectLevel('MEDIUM')"
                    :class="{ selected: selectedLevel === 'MEDIUM' }">
                    <div class="option-icon">🦄</div>
                    <div class="choice-label">MEDIUM</div>
                </div>
                <div class="option-card cloud" @click="selectLevel('HARD')"
                    :class="{ selected: selectedLevel === 'HARD' }">
                    <div class="option-icon">🐉</div>
                    <div class="choice-label">HARD</div>
                </div>
            </div>

            <!-- 게임 시작 버튼 -->
            <button class="start-game-btn" @click="startGame" :disabled="!selectedType || !selectedLevel">
                Let's Start!
            </button>

        </div>

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const selectedType = ref(null);
const selectedLevel = ref(null);

const selectType = (type) => { selectedType.value = type; };
const selectLevel = (level) => { selectedLevel.value = level; };

const startGame = () => {
    if (selectedType.value && selectedLevel.value) {
        alert(`Starting ${selectedType.value} at ${selectedLevel.value} level!`);
    }
};

const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const addFloatingIcons = () => {
    for (let i = 0; i < 60; i++) {
        floatingIcons.value.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            top: Math.random() * 100 + "vh",
            left: Math.random() * 100 + "vw",
            speed: (5 + Math.random() * 5) + "s"
        });
    }
};

onMounted(addFloatingIcons);
</script>

<style scoped>
/* 전체 화면 설정 - 전역 CSS와 충돌했을 때 대비용으로 남겨두었습니다. */
/* body,
html {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #f8fce7, #d2f1d8);
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    color: #333;
    overflow: hidden;
} */

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;
    z-index: 1;
}

@keyframes sparkle {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
}

.sparkle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffeb3b;
    border-radius: 50%;
    animation: sparkle 2s infinite ease-in-out;
}

.sparkle:nth-child(1) {
    top: 10%;
    left: 15%;
    animation-delay: 0.3s;
}

.sparkle:nth-child(2) {
    top: 30%;
    left: 80%;
    animation-delay: 1s;
}

.sparkle:nth-child(3) {
    top: 70%;
    left: 20%;
    animation-delay: 0.7s;
}

.sparkle:nth-child(4) {
    top: 85%;
    left: 60%;
    animation-delay: 1.5s;
}

.option-container {
    display: flex;
    gap: 80px;
    justify-content: center;
    margin: 50px 0
}

.option-card.square {
    width: 200px;
    height: 200px;
    border-radius: 20px;
}


.option-card.cloud {
    width: 220px;
    height: 120px;
    border-radius: 50% 50% 40% 40%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
}

.option-card.cloud::after {
    content: '☁️';
    position: absolute;
    top: -15px;
    left: -15px;
    font-size: 50px;
    opacity: 0.1;
}

.option-card.cloud:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
}

@keyframes float-hover {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }

    100% {
        transform: translateY(0);
    }
}

.option-card.cloud {
    animation: float-hover 3s ease-in-out infinite;
}

.header {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ff7043;
    padding: 12px 30px;
    background: #fff7e0;
    border-radius: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
}

.option-card {
    width: 180px;
    height: 180px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #ff7043;
    cursor: pointer;
    position: relative;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, background-color 0.3s;
}

.option-card.selected {
    background-color: #ffd3b6;
    transform: scale(1.1);
}

.option-card:hover {
    transform: scale(1.05);
    background: #ffb3c1;
}

.option-icon {
    font-size: 3rem;
}

.choice-label {
    margin-top: 8px;
    font-size: 1.7rem;
    color: #4b5563;
    font-weight: 600;
}

.start-game-btn {
    padding: 30px 50px;
    background-color: #ff7043;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 2rem;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.start-game-btn:hover {
    background-color: #f06292;
}

.start-game-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
}

.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    z-index: 0;
    animation: float-icon infinite alternate;
}

@keyframes float-icon {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-30px);
    }
}
</style>