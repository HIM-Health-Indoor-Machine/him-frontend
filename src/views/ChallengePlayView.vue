<template>
    <div>
        <div id="ui-container">
            <transition name="fade" mode="out-in">
                <template v-if="countdown > 0">
                    <div :key="countdown" id="countdown-container">{{ countdown }}</div>
                </template>
                <template v-else>
                    <div id="temp-container">
                        <div id="label-container">Prediction Label</div>
                        <div v-if="showCounter" :key="counter" id="counter-container" class="animate-counter">
                            <span id="counter">{{ counter }}</span>
                        </div>
                    </div>
                </template>
            </transition>
        </div>

        <div id="webcam-container"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, onMounted, onUnmounted } from 'vue';
import { getCounter, init as tmInit } from '@/utils/teachableMachineForChallenge';

const counter = ref(0);
const showCounter = ref(false);
const countdown = ref(3);
let updateInterval = null;

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

onMounted(() => {
    startCountdown();
});

function startCountdown() {
    function countdownStep() {
        if (countdown.value > 0) {
            countdown.value -= 1;

            console.log(countdown.value)

            nextTick(() => {
                setTimeout(countdownStep, 1500);
            });
        } else {
            countdown.value = 0;
            startGame();
        }
    }

    countdownStep();
}

function startGame() {
    tmInit();

    updateInterval = setInterval(async () => {
        try {
            const newCounterValue = await getCounter();
            if (newCounterValue !== counter.value) {
                counter.value = newCounterValue;
                showCounter.value = true;
                setTimeout(() => {
                    showCounter.value = false;
                }, 1500);
            }
        } catch (error) {
            console.error("카운터 업데이트 중 오류 발생:", error);
        }
    }, 100);
}
</script>


<style scoped>
#temp-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 95vh;
    gap: 10px;
    z-index: 10;
    transition: all 0.3s ease-in-out;
}

#ui-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100vw;
    height: 100vh;
    gap: 10px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.8));
    animation: background-pulse 3s infinite alternate ease-in-out;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}

#countdown-container {
    font-size: 15rem;
    font-weight: bold;
    color: #ff3b3b;
    text-shadow: 0px 0px 15px rgba(255, 0, 0, 0.8);
    animation: countdown-zoom 1s ease-in-out, fadeIn 1s ease-in-out;
    transition: all 0.3s ease-in-out;
}

@keyframes countdown-zoom {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes background-pulse {
    0% { background-color: rgba(0, 0, 0, 0.8); }
    50% { background-color: rgba(50, 0, 0, 0.9); }
    100% { background-color: rgba(0, 0, 0, 0.8); }
}

@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

#label-container {
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    color: #4b5563;
}

#counter-container {
    font-size: 10rem;
    font-weight: bold;
    color: #a9b6aa;
    text-shadow: 0px 0px 15px rgba(62, 66, 61, 0.8);
}

.animate-counter {
    animation: counter-zoom 1s ease-in-out;
}

@keyframes counter-zoom {
    0% { transform: scale(1); opacity: 0; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

#webcam-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0;
    overflow: hidden;
    background-color: transparent;
}
</style>
