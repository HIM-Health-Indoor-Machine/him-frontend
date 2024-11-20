<template>
    <div>
        <div id="webcam-container"></div>
        <div id="label-container">Prediction Label</div>

        <div v-if="countdown > 0">
            <div class="countdown-container">
                <div :key="countdown" id="countdown-container">{{ countdown === 4 ? "" : countdown }}</div>
            </div>
        </div>
        <div v-else>
            <div id="ui-container">
                <div class="challenge-info">
                    <p>챌린지: {{ challengeStore.currentChallenge.title }}</p>
                    <p>운동 종류: {{ challengeStore.currentChallenge.type === 'PUSHUP' ? 'Push Up' : 'Squat' }}</p>
                    <p>종료 날짜: {{ challengeStore.currentChallenge.endDt }}</p>
                    <p>성취 개수: {{ challengeStore.currentChallenge.achievedCnt }}</p>
                    <p>목표 개수: {{ challengeStore.currentChallenge.goalCnt }}</p>
                </div>
                <div v-if="showCounter" :key="counter" id="counter-container" class="animate-counter">
                    <span id="counter">{{ counter }}</span>
                </div>
            </div>
        </div>

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
import { nextTick, ref, onMounted, onUnmounted } from 'vue';
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachineForChallenge';
import { useTodayChallengeStore } from '@/stores/todayChallenge';
import { useChallengeStore } from '@/stores/challenge';

const todayChallengeStore = useTodayChallengeStore();
const challengeStore = useChallengeStore();

const router = useRouter();
const route = useRoute();

const challengeId = route.params.challengeId;
const { currentTodayChallenge } = storeToRefs(todayChallengeStore);
const counter = ref(0);
const showCounter = ref(false);
const countdown = ref(5);
const isModalOpen = ref(false);
let updateInterval = null;
const challengeTitle = ref("");
const userId = route.params.userId;


onMounted(() => {
    challengeStore.fetchCurrentChallenge(challengeId);
    startCountdown();

    tmInit().then(() => {
        console.log("Teachable Machine 초기화 완료");
    }).catch((error) => {
        console.error("Teachable Machine 초기화 중 오류 발생:", error);
    });
});

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    tmStop();
});

// const fetchChallengeData = () => {
//     try {
        
//         challengeTitle.value =  || "제목 없음";
//     } catch (error) {
//         console.error("챌린지 데이터를 가져오는 중 오류 발생:", error);
//     }
// };


function openSaveModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

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

    currentTodayChallenge.value.cnt += counter.value; // cnt 업데이트
    await todayChallengeStore.updateTodayChallenge(currentTodayChallenge.value);

    router.push({ 
        name: 'ChallengeSelectView',
        params: { userId: userId }
    });
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
    justify-content: flex-start;
    position: relative;
    height: 95vh;
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

.countdown-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.8));
    animation: background-pulse 1s infinite alternate ease-in-out;
    z-index: 10;
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
    font-size: 1.5rem;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
}
</style>