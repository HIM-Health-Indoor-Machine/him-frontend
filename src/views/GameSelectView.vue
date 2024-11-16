<template>
    <div>
        <div class="main-container">
            <div class="header">게임을 선택해주세요!</div>

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

            <button @click="startGame"
                    class="custom-button"
                    :style="{ animation: (!selectedType || !selectedLevel) ? 'jittery 4s infinite' : '' }"
                    :disabled="!selectedType || !selectedLevel">
                <span>시작하기</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4"
                width="130" height="130" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" width="80" height="80" d="M9 5l7 7-7 7" />
                </svg>
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
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';

const router = useRouter();
const gameStore = useGameStore();

const selectedType = ref(null);
const selectedLevel = ref(null);

const selectType = (type) => { selectedType.value = type; };
const selectLevel = (level) => { selectedLevel.value = level; };

const startGame = () => {
    if (selectedType.value && selectedLevel.value) {
        router.push({
            name: 'GamePlayView',
            query: {
                type: selectedType.value,
                level: selectedLevel.value
            }
        });
    }
const startGame = async () => {
    await gameStore.createGame(selectedType.value, selectedLevel.value, 1);
    router.push({
        name: 'GamePlayView',
        state: {
            id: gameStore.gameId,
            type: gameStore.gameType,
            difficultyLevel: gameStore.gameDifficultyLevel,
            userId: gameStore.gameUserId
        }
    });
};
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
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-in-out;
    padding-top: 150px;
    padding-bottom: 70px;
    transition: all 0.3s ease-in-out;
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
    padding: 20px 40px;
    background: #fff7e0;
    border-radius: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    transition: all 0.3s ease-in-out;
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
    transition: all 0.3s ease-in-out;
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

.custom-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px 15px;
    background-color: #ff7043;
    border: 4px solid #d95c37;
    border-radius: 9999px;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    box-sizing: border-box;
    animation: jittery 4s infinite;
}

.custom-button svg {
    width: 30%;
    height: 20%;
}

.custom-button span {
    margin-right: 8px;
}

.custom-button:hover {
    background: #f06292;
    transform: scale(1.05);
}

.custom-button:disabled {
    background-color: #cccccc;
    border: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
}

@keyframes jittery {
  5%,
  50% {
    transform: scale(1);
  }

  10% {
    transform: scale(0.9);
  }

  15% {
    transform: scale(1.15);
  }

  20% {
    transform: scale(1.15) rotate(-5deg);
  }

  25% {
    transform: scale(1.15) rotate(5deg);
  }

  30% {
    transform: scale(1.15) rotate(-3deg);
  }

  35% {
    transform: scale(1.15) rotate(2deg);
  }

  40% {
    transform: scale(1.15) rotate(0);
  }
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