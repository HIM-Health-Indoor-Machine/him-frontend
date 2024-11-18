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

        <button v-if="countdown === 0" @click="openSaveModal" class="save-button">저장하기</button>

        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal">
                <p>현재까지의 운동 횟수: {{ counter }}</p>
                <p>저장하시겠습니까?</p>
                <div class="modal-buttons">
                    <button @click="saveAndNavigate" class="confirm-button">저장</button>
                    <button @click="closeModal" class="cancel-button">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { nextTick, ref, computed, onMounted, onUnmounted } from 'vue';
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachineForChallenge';
import { useTodayChallengeStore } from '@/stores/todayChallenge';

const store = useTodayChallengeStore();
const router = useRouter();
const route = useRoute();

const challengeId = route.params.challengeId;
const { currentTodayChallenge } = storeToRefs(store);
const counter = ref(0);
const showCounter = ref(false);
const countdown = ref(3);
const isModalOpen = ref(false);
let updateInterval = null;

onMounted(() => {
    startCountdown();
});

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    tmStop();
});

function openSaveModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

async function saveAndNavigate() {
    console.log(`저장된 운동 횟수: ${counter.value}`);
    isModalOpen.value = false;
    await store.fetchTodayChallenge(challengeId, new Date().toISOString().split("T")[0]);
    currentTodayChallenge.value.cnt += counter.value;
    await store.updateTodayChallenge(currentTodayChallenge.value);
    router.push({ name: 'ChallengeSelectView' });
}

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

.save-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 20px 40px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    transition: background-color 0.3s;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.save-button:hover {
    background-color: #45a049;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    border-radius: 10px;
    text-align: center;
    font-size: 2rem;
    width: 500px;
    height: 300px;
    line-height: 0;
}

.modal-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.confirm-button, .cancel-button {
    padding: 10px 40px;
    font-size: 2rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.confirm-button {
    background-color: #4CAF50;
    color: white;
}

.cancel-button {
    background-color: #f44336;
    color: white;
}
</style>