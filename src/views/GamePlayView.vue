<template>
    <div>
        <div id="webcam-container"></div>
        <div id="label-container" style="display: none;"></div>
        <div id="pixi-container"></div>

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
            <div id="ui-container">
                <div class="game-info">
                    <p>운동 종류: {{ gameType === 'PUSHUP' ? 'Push Up' : 'Squat' }}</p>
                    <p>난이도: {{ gameDifficultyLevel }}</p>
                </div>
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
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachine';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';
import { gsap } from 'gsap';

const gameStore = useGameStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isEndModalOpen = ref(false);
const isLoading = ref(true);
const app = ref(null);
const isGameOver = ref(false);
const isSuccess = ref(false);
const countdown = ref(4);
const prevTier = ref('');
let updateInterval = null;

const gameId = route.params.id;
const gameType = ref('');
const gameDifficultyLevel = ref('');
gameDifficultyLevel.value = route.params.difficultyLevel;
const gameTheme = route.params.theme;
const userId = route.params.userId;

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
    const themes = {
        GamePlayViewDuck: {
            background: '/images/background/duck_background.jpg',
            framePath: '/images/duck_frames/frame_',
            frameCount: 144,
        },
        GamePlayViewBomb: {
            background: '/images/background/bomb_background.jpg',
            framePath: '/images/bomb_frames/frame_',
            frameCount: 23,
        },
        GamePlayViewFlying: {
            background: '/images/background/flying_background.jpg',
            framePath: '/images/flying_frames/frame_',
            frameCount: 90,
        },
    };

    const theme = themes[gameTheme];
    if (!theme) {
        throw new Error(`Unknown game theme: ${gameTheme}`);
    }

    const backgroundTexture = await Assets.load(theme.background);
    const frames = await loadFrames(theme.framePath, theme.frameCount);

    return { backgroundTexture, frames };
};

const loadFrames = async (framePath, frameCount) => {
    const frames = [];
    for (let i = 1; i <= frameCount; i++) {
        const frameNumber = i.toString().padStart(4, '0');
        const texture = await Assets.load(`${framePath}${frameNumber}.png`);
        frames.push(texture);
    }
    return frames;
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

    const { backgroundTexture, frames } = await loadAssets(gameTheme);

    const background = new Sprite(backgroundTexture);
    background.width = app.value.screen.width;
    background.height = app.value.screen.height;
    app.value.stage.addChild(background);

    let frame = 0;
    let frameCounter = 0;
    let counterValue = 0;

    const themeSettings = {
        GamePlayViewDuck: {
            spritePosition: {
                x: app.value.screen.width - 300,
                y: app.value.screen.height / 2 + 300,
            },
            gameOverLimit: app.value.screen.width - 50,
            successLimit: 150,
            frameInterval: 1,
            difficulties: {
                EASY: { countMoveSpeed: 200, penaltyMoveSpeed: 2 },
                MEDIUM: { countMoveSpeed: 200, penaltyMoveSpeed: 3 },
                HARD: { countMoveSpeed: 200, penaltyMoveSpeed: 4 },
            },
        },
        GamePlayViewBomb: {
            spritePosition: {
                x: app.value.screen.width - 250,
                y: app.value.screen.height / 2 + 200,
            },
            gameOverLimit: app.value.screen.width,
            successLimit: 100,
            frameInterval: 3,
            difficulties: {
                EASY: { countMoveSpeed: 200, penaltyMoveSpeed: 2 },
                MEDIUM: { countMoveSpeed: 200, penaltyMoveSpeed: 3 },
                HARD: { countMoveSpeed: 200, penaltyMoveSpeed: 4 },
            },
        },
        GamePlayViewFlying: {
            spritePosition: {
                x: app.value.screen.width / 2,
                y: app.value.screen.height - 200,
            },
            gameOverLimit: app.value.screen.height + 100,
            successLimit: 0,
            frameInterval: 3,
            difficulties: {
                EASY: { countMoveSpeed: 150, penaltyMoveSpeed: 2 },
                MEDIUM: { countMoveSpeed: 150, penaltyMoveSpeed: 3 },
                HARD: { countMoveSpeed: 150, penaltyMoveSpeed: 4 },
            },
        },
    };

    const themeConfig = themeSettings[gameTheme];
    if (!themeConfig) {
        throw new Error(`Unknown game theme: ${gameTheme}`);
    }

    const sprite = new Sprite(frames[0]);
    sprite.x = themeConfig.spritePosition.x;
    sprite.y = themeConfig.spritePosition.y;
    sprite.anchor.set(0.5);
    app.value.stage.addChild(sprite);

    const { gameOverLimit, successLimit, frameInterval, difficulties } = themeConfig;

    const difficultyConfig = difficulties[gameDifficultyLevel.value];
    if (!difficultyConfig) {
        throw new Error(`Unknown difficulty level: ${gameDifficultyLevel.value}`);
    }

    const { countMoveSpeed, penaltyMoveSpeed } = difficultyConfig;

    function updateRunnerAnimation() {
        if (!isGameOver.value) {
            frameCounter++;
            if (frameCounter >= frameInterval) {
                frame = (frame + 1) % frames.length;
                sprite.texture = frames[frame];
                frameCounter = 0;
            }
        }
    }

    async function updateCounterForTheme() {
        const newCounterValue = await getCounter();
        if (newCounterValue > counterValue && !isGameOver.value) {
            const deltaValue = (newCounterValue - counterValue) * countMoveSpeed;

            if (gameTheme === "GamePlayViewDuck" || gameTheme === "GamePlayViewBomb") {
                gsap.to(sprite, {
                    x: sprite.x - deltaValue,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            } else if (gameTheme === "GamePlayViewFlying") {
                const deltaX = 100 * Math.sin(Date.now() / 500);
                const leftLimit = 420;
                const rightLimit = app.value.screen.width - sprite.width;

                let newX = sprite.x + deltaX;
                newX = Math.max(leftLimit, Math.min(newX, rightLimit));

                gsap.to(sprite, {
                    y: sprite.y - deltaValue,
                    x: newX,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
        }
        counterValue = newCounterValue;
    }

    function moveRunner() {
        if (!isGameOver.value) {
            if (gameTheme === "GamePlayViewDuck" || gameTheme === "GamePlayViewBomb") {
                sprite.x += penaltyMoveSpeed;
                if (sprite.x >= gameOverLimit) {
                    sprite.x = gameOverLimit;
                    gameOver();
                }
            } else if (gameTheme === "GamePlayViewFlying") {
                sprite.y += penaltyMoveSpeed;
                if (sprite.y >= gameOverLimit) {
                    sprite.y = gameOverLimit;
                    gameOver();
                }
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
                type: gameType.value,
                difficultyLevel: gameDifficultyLevel.value,
                theme: gameTheme,
                userId: userId
            }
        });
    }

    function checkRunnerSuccess() {
        if (!isGameOver.value) {
            if (gameTheme === "GamePlayViewDuck" || gameTheme === "GamePlayViewBomb") {
                if (sprite.x <= successLimit) {
                    sprite.x = successLimit;
                    success();
                }
            } else if (gameTheme === "GamePlayViewFlying") {
                if (sprite.y <= successLimit) {
                    sprite.y = successLimit;
                    success();
                }
            }
        }
    }

    async function success() {
        isSuccess.value = true;
        sprite.texture = frames[0];
        stopRunnerOnSuccess();

        await gameStore.achieveGame(gameId, isSuccess.value);

        tmStop();
        router.push({
            name: 'SuccessScreen',
            params: {
                id: gameId,
                type: gameType.value,
                difficultyLevel: gameDifficultyLevel.value,
                userId: userId,
                prevTier: prevTier.value,
                expPoints: gameStore.gameExpPoints,
            }
        });
    }

    function stopRunnerOnSuccess() {
        if (isSuccess.value) {
            app.value.ticker.stop();
        }
    }

    app.value.ticker.add(() => {
        if (countdown.value === 0) {
            if (!isGameOver.value && !isSuccess.value) {
                updateCounterForTheme();
                updateRunnerAnimation();
                moveRunner();
            }
            checkRunnerSuccess();
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
    gameType.value = route.params.type;
    try {
        await tmInit(gameType.value, "GAME");
        console.log("Teachable Machine 초기화 완료");

        await userStore.fetchUserInfo(userId);
        prevTier.value = userStore.userTier;

        await startPixiAndTM();

    } catch (error) {
        console.error("초기화 중 오류 발생:", error);
    }

    isLoading.value = false;
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

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
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