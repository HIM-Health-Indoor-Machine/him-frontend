<template>
    <div>
        <div id="webcam-container"></div>
        <div id="label-container">Prediction Label</div>
        <div id="pixi-container"></div>

        <div v-if="countdown > 0">
            <div class="countdown-container">
                <div :key="countdown" id="countdown-container">{{ countdown === 4 ? "" : countdown }}</div>
            </div>
        </div>
        <div v-else>
            <div id="ui-container">
                <div class="game-info">
                    <p>운동 종류: {{ gameStore.typeString }}</p>
                    <p>난이도: {{ gameStore.gameDifficultyLevel }}</p>
                </div>
                <div id="counter-container">Count: <span id="counter">{{ counter }}</span></div>
            </div>
            <button v-if="countdown === 0" @click="openEndModal" class="end-button">끝내기</button>
        </div>

        <div v-if="isEndModalOpen" class="modal-overlay">
            <div class="modal">
                <p>정말 끝내시겠습니까?</p>
                <div class="modal-buttons">
                    <button @click="navigateToGameSelect" class="confirm-button">네</button>
                    <button @click="closeEndModal" class="cancel-button">아니요</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { Application, Sprite, Assets } from 'pixi.js';
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachineForGame';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';
import { gsap } from 'gsap';

const gameStore = useGameStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isEndModalOpen = ref(false);
const app = ref(null);
const counter = ref(0);
const isGameOver = ref(false);
const isSuccess = ref(false);
const countdown = ref(5);
const prevTier = ref('');

const gameId = route.params.id;
const gameType = route.params.type;
const gameDifficultyLevel = route.params.difficultyLevel;
const gameTheme = route.params.theme;
const userId = route.params.userId;


let updateInterval = null;

const openEndModal = () => {
    isEndModalOpen.value = true;
};

const closeEndModal = () => {
    isEndModalOpen.value = false;
};

const navigateToGameSelect = () => {
    isGameOver.value = true;
    if (app.value) {
        app.value.ticker.stop();
    }
    tmStop();
    router.push({ name: 'GameSelectView' });
};

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    tmStop();
});

const loadAssets = async () => {
    const backgroundTexture = await Assets.load('/images/background/duck_background.jpg');
    const frames = [];
    for (let i = 0; i <= 143; i++) {
        const frameNumber = i.toString().padStart(4, '0');
        const texture = await Assets.load(`/images/duck_frames/frame_${frameNumber}.png`);
        frames.push(texture);
    }
    return { backgroundTexture, frames };
};

const startPixiAndTM = async () => {
    app.value = new Application();
    await app.value.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
    });

    const pixiContainer = document.getElementById("pixi-container");
    if (pixiContainer) {
        pixiContainer.appendChild(app.value.canvas);
    } else {
        console.error("'pixi-container' 요소가 존재하지 않습니다.");
        return;
    }

    const webcamContainer = document.getElementById("webcam-container");
    if (!webcamContainer) {
        console.error("'webcam-container' 요소가 존재하지 않습니다.");
        return;
    }

    const { backgroundTexture, frames } = await loadAssets();

    const background = new Sprite(backgroundTexture);
    background.width = app.value.screen.width;
    background.height = app.value.screen.height;
    app.value.stage.addChild(background);

    const duckSprite = new Sprite(frames[0]);
    duckSprite.x = app.value.screen.width - 300;
    const gameOverLimit = app.value.screen.width - 200;
    const successLimit = 150;
    duckSprite.y = app.value.screen.height / 2 + 300;
    duckSprite.anchor.set(0.5);
    app.value.stage.addChild(duckSprite);

    let frame = 0;
    let frameCounter = 0;
    let counterValue = 0;

    let countMoveSpeed = 0;

    if(gameStore.gameDifficultyLevel === 'EASY') {
        countMoveSpeed = 200;
    } else if(gameStore.gameDifficultyLevel === 'MEDIUM') {
        countMoveSpeed = 100;
    } else {
        countMoveSpeed = 50;
    }
    const penaltyMoveSpeed = 0.5;
    const frameInterval = 1;


    function updateRunnerAnimation() {
        if (!isGameOver.value) {
            frameCounter++;
            if (frameCounter >= frameInterval) {
                frame = (frame + 1) % frames.length;
                duckSprite.texture = frames[frame];
                frameCounter = 0;
            }
        }
    }

    async function updateCounter() {
        const newCounterValue = await getCounter();
        if (newCounterValue > counterValue && !isGameOver.value) {
            const deltaX = (newCounterValue - counterValue) * countMoveSpeed;

            gsap.to(duckSprite, {
                x: duckSprite.x - deltaX,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
        counterValue = newCounterValue;
    }

    function moveRunnerRight() {
        if (!isGameOver.value) {
            duckSprite.x += penaltyMoveSpeed;
            if (duckSprite.x >= gameOverLimit) {
                duckSprite.x = gameOverLimit;
                gameOver();
            }
        }
    }

    function gameOver() {
        isGameOver.value = true;

        tmStop();
        router.push({
            name: 'FailScreen',
            params: {
                id: gameId,
                type: gameType,
                difficultyLevel: gameDifficultyLevel,
                theme: gameTheme,
                userId: userId
            }
        });
    }

    function checkRunnerRight() {
        if (duckSprite.x <= successLimit && !isGameOver.value) {
            duckSprite.x = successLimit;
            success();
        }
    }

    async function success() {
        isSuccess.value = true;
        duckSprite.texture = frames[0];
        stopRunnerOnSuccess();

        await gameStore.achieveGame(gameStore.gameId, isSuccess.value);

        tmStop();
        router.push({ 
            name: 'SuccessScreen',
            params: {
                userId: userId,
                prevTier: prevTier.value,
                expPoints: gameStore.gameExpPoints
            }
        });
    }

    function stopRunnerOnSuccess() {
        if (isSuccess.value) {
            app.value.ticker.stop();
        }
    }

    app.value.ticker.add(() => {
        if (countdown.value == 0) {
            if (!isGameOver.value && !isSuccess.value) {
                updateCounter();
                updateRunnerAnimation();
                moveRunnerRight();
            }
            checkRunnerRight();
        }
    });
};

const startCountdown = () => {
    const countdownStep = () => {
        if (countdown.value > 0) {
            countdown.value -= 1;
            console.log(countdown.value);
            nextTick(() => setTimeout(countdownStep, 1000));
        } else {
            countdown.value = 0;
            console.log("카운트다운 종료");
        }
    };
    countdownStep();
};

onMounted(async () => {
    tmInit().then(() => {
        console.log("Teachable Machine 초기화 완료");
    }).catch((error) => {
        console.error("Teachable Machine 초기화 중 오류 발생:", error);
    });

    await userStore.fetchUserInfo(userId);
    prevTier.value = userStore.userTier;
    startPixiAndTM();

    startCountdown();
});
</script>

<style scoped>
#pixi-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
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

#label-container,
#counter-container {
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    color: #4b5563;
}

#webcam-container {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 400px;
    height: 250px;
    border: 2px solid #ff7043;
    border-radius: 12px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 2;
    transition: all 0.3s ease-in-out;
}

#countdown-container {
    font-size: 15rem;
    font-weight: bold;
    color: #ff3b3b;
    text-shadow: 0px 0px 15px rgba(255, 0, 0, 0.8);
    animation: countdown-zoom 1s ease-in-out, fadeIn 1s ease-in-out;
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

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
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

#countdown-text {
    font-size: 15rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 0px 15px rgba(0, 0, 0, 0.8);
}

.end-button {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 40px;
    background-color: #ff7043;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    transition: background-color 0.3s;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.end-button:hover {
    background-color: #f06292;
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
    padding: 10px 30px;
    font-size: 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.confirm-button {
    background-color: #ff7043;
    color: white;
}

.cancel-button {
    background-color: #cccccc;
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

.game-info {
    font-size: 1.5rem;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
}
</style>