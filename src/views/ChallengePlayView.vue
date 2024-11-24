<template>
    <div class="main-container">
        <div id="webcam-container"></div>
        <div id="label-container" style="display: none;"></div>

        <div v-if="isLoading" class="loading-container">
            <div class="loading-text">준비중입니다. 잠시만 기다려주세요!</div>
            <div class="spinner"></div>
        </div>

        <div v-else-if="countdown > 0">
            <div class="countdown-container">
                <div :key="countdown" id="countdown-container">{{ countdown }}</div>
            </div>
        </div>

        <div v-else>
            <div class="challenge-info">
                <p>챌린지: {{ challengeStore.currentChallenge.title }}</p>
                <p>운동 종류: {{ challengeStore.currentChallenge.type === 'PUSHUP' ? 'Push Up' : 'Squat' }}</p>
                <p>종료 날짜: {{ challengeStore.currentChallenge.endDt }}</p>
                <p>성취 개수: {{ challengeStore.currentChallenge.achievedCnt }}</p>
                <p>목표 개수: {{ challengeStore.currentChallenge.goalCnt }}</p>
            </div>
            <div id="ui-container">
                <div :key="counter" id="counter-container" class="animate-counter">
                    <span id="counter">{{ counter }}</span>
                </div>
            </div>

            <button @click="openSaveModal" class="save-button">저장하기</button>
        </div>

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
import { nextTick, ref, onMounted, onUnmounted } from 'vue';
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachine';
import { useTodayChallengeStore } from '@/stores/todayChallenge';
import { useChallengeStore } from '@/stores/challenge';
import { useUserStore } from '@/stores/user';

const todayChallengeStore = useTodayChallengeStore();
const challengeStore = useChallengeStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const challengeId = route.params.challengeId;
const { currentTodayChallenge } = storeToRefs(todayChallengeStore);
const { currentChallenge } = storeToRefs(challengeStore);
const counter = ref(0);
const countdown = ref(4);
const isModalOpen = ref(false);
let updateInterval = null;
const userId = route.params.userId;
const isLoading = ref(true);

onMounted(async () => {
    await challengeStore.fetchCurrentChallenge(challengeId);
    await tmInit(currentChallenge.value.type, "CHALLENGE").then(() => {
        console.log("Teachable Machine 초기화 완료");
    }).catch((error) => {
        console.error("Teachable Machine 초기화 중 오류 발생:", error);
    });

    isLoading.value = false;
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

const prevTier = ref('');
const prevExp = ref(0);

async function saveAndNavigate() {
    console.log(`저장된 운동 횟수: ${counter.value}`);
    isModalOpen.value = false;

    await todayChallengeStore.fetchTodayChallenge(challengeId, new Date().toISOString().split("T")[0]);

    if (typeof currentTodayChallenge.value !== 'object' || currentTodayChallenge.value === null) {
        currentTodayChallenge.value = {
            id: null,
            cnt: 0,
            challengeId,
            date: new Date().toISOString().split("T")[0],
        };
    }

    await userStore.fetchUserInfo(userId);
    prevTier.value = userStore.userTier;
    prevExp.value = userStore.userExp;

    currentTodayChallenge.value.cnt += counter.value;
    await todayChallengeStore.updateTodayChallenge(currentTodayChallenge.value);

    if (currentChallenge.value.goalCnt <= currentTodayChallenge.value.cnt) {
        router.push({
            name: 'ChallengeSuccessScreen',
            params: {
                id: challengeId,
                userId: userId,
                prevTier: prevTier.value,
                prevExp: prevExp.value,
            }
        });
    } else {
        router.push({
            name: 'ChallengeSelectView',
            params: { userId: userId }
        });
    }
}

function startCountdown() {
    const countdownStep = () => {
        if (countdown.value > 0) {
            countdown.value -= 1;
            nextTick(() => setTimeout(countdownStep, 1000));
        } else {
            countdown.value = 0;
            startGame();
        }
    };
    countdownStep();
}

function startGame() {
    updateInterval = setInterval(async () => {
        try {
            const newCounterValue = await getCounter();
            if (newCounterValue !== counter.value) {
                counter.value = newCounterValue;
            }
        } catch (error) {
            console.error("카운터 업데이트 중 오류 발생:", error);
        }
    }, 100);
}
</script>


<style scoped>
.main-container {
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: black;
}

#ui-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    height: 100vh;
    gap: 10px;
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
    0% {
        transform: scale(0.8);
        opacity: 0;
    }

    50% {
        transform: scale(1.2);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes background-pulse {
    0% {
        background-color: rgba(0, 0, 0, 0.8);
    }

    50% {
        background-color: rgba(50, 0, 0, 0.9);
    }

    100% {
        background-color: rgba(0, 0, 0, 0.8);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

#label-container {
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    color: #4b5563;
}

#counter-container {
    position: fixed;
    top: 40%;
    left: 50%;
    font-size: 10rem;
    font-weight: bold;
    color: #a9b6aa;
    text-shadow: 0px 0px 15px rgba(62, 66, 61, 0.8);
}

.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #000000;
    font-size: 3rem;
    color: #ffffff;
    z-index: 10;
}

.loading-text {
    animation: pulse 1.5s infinite;
}

.spinner {
    margin-top: 20px;
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top: 5px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.countdown-container {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.8));
    animation: background-pulse 1s infinite alternate ease-in-out;
}

.animate-counter {
    animation: counter-zoom 1s ease-in-out;
}

@keyframes counter-zoom {
    0% {
        transform: scale(1);
        opacity: 0;
    }

    50% {
        transform: scale(1.5);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

#webcam-container {
    position: fixed;
    top: 0;
    left: 0;
    object-fit: cover;
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

.confirm-button,
.cancel-button {
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

.challenge-info {
    position: fixed;
    top: 10px;
    left: 80px;
    font-size: 1.5rem;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
}
</style>