<template>
    <div>
        <div id="success-overlay" v-if="isGameSuccess">
            <div id="success-text">SUCCESS!</div>
            <div id="celebration-message">축하합니다! 목표를 달성했습니다!</div>

            <div class="exp-tier-container">
                <img class="exp-tier-pic" :src="curTierIcon" alt="현재 티어 사진" />
                <div class="exp-bar-container">
                    <div class="exp-bar-fill" :style="{ width: expFilledBarWidth + '%' }"></div>
                </div>
                <img class="exp-tier-pic" :src="nextTierIcon" alt="다음 티어 사진" />
            </div>

            <div class="exp-value" :style="{ '--total-exp': `'${addedExpString}'` }">현재 경험치: {{ expValue }} EXP</div>

            <button class="new-challenge-button" @click="restartGame">NEW GAME</button>

            <div v-for="firework in fireworks" :key="firework.id" class="firework"
                :style="{ left: firework.left + '%', top: firework.top + '%', backgroundColor: firework.color }">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import curTierImage from '@/assets/images/tier/tier_IRON.png';
import nextTierImage from '@/assets/images/tier/tier_BRONZE.png';

const curTierIcon = ref(curTierImage)
const nextTierIcon = ref(nextTierImage)

const isGameSuccess = ref(true);
const fireworks = ref([]);
const currentExp = ref(400);
const addedExp = ref(30);
const targetExp = ref(1000);
const expValue = ref(currentExp.value);
const expFilledBarWidth = ref((expValue.value / targetExp.value) * 100);

const totalExp = currentExp.value + addedExp.value;

// 경험치 증가에 따라 경험치 바 반영
const increaseExp = () => {
    let interval = setInterval(() => {
        if (expValue.value < totalExp) {
            expValue.value += 1;
        } else {
            clearInterval(interval);
        }
    }, 30);
};

// 경험치 값 변경에 따라 바 너비 업데이트
watch(expValue, (newVal) => {
    expFilledBarWidth.value = (newVal / targetExp.value) * 100;
});

const createFireworks = () => {
    const colors = ['#FFD700', '#FF4500', '#4CAF50', '#FF69B4', '#00FFFF'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            fireworks.value.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }, i * 100);
    }
};

onMounted(() => {
    createFireworks();
    increaseExp();
});

const restartGame = () => {
    isGameSuccess.value = false;
    console.log("New game started!");
};

const addedExpString = computed(() => `+${addedExp.value} EXP!`);
</script>

<style scoped>
#success-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 100;
    gap: 30px;
    text-align: center;
    overflow: hidden;
    transition: all 0.3s ease-in-out;

}

#success-text {
    font-size: 6rem;
    font-weight: bold;
    color: #4CAF50;
    text-shadow: 0px 0px 10px rgba(0, 255, 0, 0.6);
    animation: bounceIn 1s ease-in-out, pulse 1.5s ease-in-out infinite alternate;
}

#celebration-message {
    font-size: 1.5rem;
    margin-top: 20px;
    color: #66bb6a;
    animation: fadeIn 1.5s ease-in-out;
}

.exp-tier-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 700px;
}

.exp-tier-pic {
    width: 70px;
    height: 74px;
    margin-bottom: 5px;
    margin-top: 5px;
}

.exp-bar-container {
    position: relative;
    width: 700px;
    height: 30px;
    background: linear-gradient(135deg, #f0f0f0, #dcdcdc);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.exp-bar-fill {
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, #a8e063, #56ab2f);
    border-radius: 15px 0 0 15px;
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.exp-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    filter: blur(8px);
    transform: translateX(-100%);
    animation: shine 2s infinite linear;
}

@keyframes expIncrease {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }

}

@keyframes shine {
    0% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(200%);
    }
}

.firework {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0);
    animation: explode 3s ease-out forwards;
    opacity: 0;
    z-index: -1;
}

@keyframes explode {
    0% {
        transform: scale(0.1);
        opacity: 1;
    }

    50% {
        opacity: 1;
    }

    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }

    50% {
        transform: scale(1.05);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes expIncrease {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

.new-challenge-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    margin-top: 30px;
    padding: 15px 30px;
    background-color: #4CAF50;
    border: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
}

.new-challenge-button:hover {
    background-color: #66bb6a;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
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

@keyframes pulseGlow {

    0%,
    100% {
        transform: scale(1);
        text-shadow:
            0 0 8px rgba(192, 192, 192, 0.8),
            0 0 16px rgba(192, 192, 192, 0.6),
            0 0 24px rgba(192, 192, 192, 0.4);
    }

    50% {
        transform: scale(1.1);
        text-shadow:
            0 0 16px rgba(192, 192, 192, 1),
            0 0 24px rgba(192, 192, 192, 0.8),
            0 0 32px rgba(192, 192, 192, 0.6);
    }
}

.exp-value::after {
    content: var(--total-exp);
    font-size: 1.3rem;
    color: #1B5E20;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: riseUp 1.5s ease-out forwards;
}

@keyframes riseUp {
    0% {
        opacity: 0;
        transform: translate(-50%, 20px);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -10px);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -30px);
    }
}
</style>