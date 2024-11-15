<template>
    <div>
        <transition name="fade" mode="out-in">
            <template v-if="countdown > 0">
                <div class="countdown-container">
                    <div :key="countdown" id="countdown-container">{{ countdown }}</div>
                </div>
            </template>
            <template v-else>
                <div>
                    <div id="pixi-container"></div>

                    <div id="ui-container">
                        <div id="label-container">Prediction Label</div>
                        <div id="counter-container">Count: <span id="counter">{{ counter }}</span></div>
                    </div>
                    <div id="webcam-container"></div>

                    <button v-if="countdown === 0" @click="openEndModal" class="end-button">끝내기</button>
                </div>

            </template>
        </transition>

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
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { Application, Sprite, Assets, Text } from 'pixi.js';
import { getCounter, init as tmInit, stop as tmStop } from '@/utils/teachableMachineForGame';

const router = useRouter();
const isEndModalOpen = ref(false);

const app = ref(null);
const counter = ref(0);
const isGameOver = ref(false);
const isSuccess = ref(false);

const countdown = ref(4);
let updateInterval = null;

function openEndModal() {
    isEndModalOpen.value = true;
}

function closeEndModal() {
    isEndModalOpen.value = false;
}

function navigateToGameSelect() {
    isGameOver.value = true;
    if (app.value) {
        app.value.ticker.stop();
    }
    tmStop();
    router.push({ name: 'GameSelectView' });
}

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    tmStop();
});

async function startPixiAndTM() {
    app.value = new Application();
    await app.value.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb
    });
    document.getElementById("pixi-container").appendChild(app.value.canvas);

    const backgroundTexture = await Assets.load('/images/background/background3.png');
    const runnerTextures = [
        await Assets.load('/images/rabbit/rabbit1.png'),
        await Assets.load('/images/rabbit/rabbit2.png'),
        await Assets.load('/images/rabbit/rabbit3.png'),
        await Assets.load('/images/rabbit/rabbit4.png'),
        await Assets.load('/images/rabbit/rabbit5.png'),
        await Assets.load('/images/rabbit/rabbit6.png'),
        await Assets.load('/images/rabbit/rabbit7.png'),
        await Assets.load('/images/rabbit/rabbit8.png'),
        await Assets.load('/images/rabbit/rabbit9.png')
    ];

    const background = new Sprite(backgroundTexture);
    background.width = app.value.screen.width;
    background.height = app.value.screen.height;
    app.value.stage.addChild(background);

    const runner = new Sprite(runnerTextures[0]);
    runner.x = 200;
    const gameOverLimit = 40;
    runner.y = app.value.screen.height - app.value.screen.height / 2;
    runner.scale.set(0.5);
    app.value.stage.addChild(runner);

    let frame = 0;
    let frameCounter = 0;
    const frameInterval = 10;
    let counterValue = 0;
    let isFalling = false;

    function updateRunnerAnimation() {
        frameCounter++;
        if (frameCounter >= frameInterval) {
            frame = (frame + 1) % runnerTextures.length;
            runner.texture = runnerTextures[frame];
            frameCounter = 0;
        }
    }

    await tmInit();

    async function updateCounter() {
        const newCounterValue = await getCounter();
        if (newCounterValue > counterValue && !isGameOver.value) {
            runner.x = 100 + newCounterValue * 30;
        }
        counterValue = newCounterValue;
    }

    function moveRunnerLeft() {
        if (!isGameOver.value) {
            runner.x -= 1;
            if (runner.x <= gameOverLimit) {
                runner.x = gameOverLimit;
                gameOver();
            }
        }
    }

    function gameOver() {
        isGameOver.value = true;
        isFalling = true;
        runner.texture = runnerTextures[0];
        router.push({ name: 'FailScreen' });
    }

    function makeRunnerFall() {
        if (isFalling) {
            runner.y += 5;
            if (runner.y >= app.value.screen.height - runner.height) {
                runner.y = app.value.screen.height - runner.height;
            }
        }
    }

    function checkRunnerRight() {
        const rightLimit = app.value.screen.width - runner.width;
        if (runner.x >= rightLimit && !isGameOver.value) {
            runner.x = rightLimit;
            success();
        }
    }

    function success() {
        isSuccess.value = true;
        isFalling = false;
        runner.texture = runnerTextures[0];
        stopRunnerOnSuccess();
        router.push({ name: 'SuccessScreen' });
    }

    function stopRunnerOnSuccess() {
        if (isSuccess.value) {
            app.value.ticker.stop();
        }
    }

    app.value.ticker.add(() => {
        if (!isGameOver.value && !isSuccess.value) {
            updateCounter();
            updateRunnerAnimation();
            moveRunnerLeft();
        }
        makeRunnerFall();
        checkRunnerRight();
    });
}

function startCountdown() {
    function countdownStep() {
        if (countdown.value > 0) {
            countdown.value -= 1;

            console.log(countdown.value)

            nextTick(() => {
                setTimeout(countdownStep, 1100);
            });
        } else {
            countdown.value = 0;
            startPixiAndTM();
        }
    }

    countdownStep();
}

onMounted(() => {
    startCountdown();
})
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
    bottom: 20px;
    right: 20px;
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
</style>