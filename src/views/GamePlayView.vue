<template>
    <div>
        <!-- Pixi.js 전체 화면 -->
        <div id="pixi-container"></div>

        <!-- UI 컨테이너 -->
        <div id="ui-container">
            <div id="title">Teachable Machine Game</div>
            <button id="start-button" @click="startGame">START</button>
            <div id="label-container">Prediction Label</div>
            <div id="counter-container">Count: <span id="counter">{{ counter }}</span></div>
        </div>

        <!-- 웹캠 컨테이너 -->
        <div id="webcam-container"></div>

        <!-- 게임 상태 오버레이 -->
        <div id="game-over-overlay" v-if="isGameOver">
            <div id="game-over-text">GAME OVER</div>
        </div>
        <div id="success-overlay" v-if="isSuccess">
            <div id="success-text">SUCCESS</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Application, Sprite, Assets, Text } from 'pixi.js';
 // TM.js 기능 가져오기
import { getCounter, init as tmInit } from '@/utils/teachableMachine';

const app = ref(null);
const counter = ref(0);
const isGameOver = ref(false);
const isSuccess = ref(false);

// Pixi.js 애플리케이션 및 게임 로직 초기화
async function startPixiAndTM() {
    app.value = new Application();
    await app.value.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb
    });
    document.getElementById("pixi-container").appendChild(app.value.canvas);

    const backgroundTexture = await Assets.load('/assets/images/background/background3.png');
    const runnerTextures = [
        await Assets.load('/assets/images/rabbit/rabbit1.png'),
        await Assets.load('/assets/images/rabbit/rabbit2.png'),
        await Assets.load('/assets/images/rabbit/rabbit3.png'),
        await Assets.load('/assets/images/rabbit/rabbit4.png'),
        await Assets.load('/assets/images/rabbit/rabbit5.png'),
        await Assets.load('/assets/images/rabbit/rabbit6.png'),
        await Assets.load('/assets/images/rabbit/rabbit7.png'),
        await Assets.load('/assets/images/rabbit/rabbit8.png'),
        await Assets.load('/assets/images/rabbit/rabbit9.png')
    ];

    // 배경 이미지 추가
    const background = new Sprite(backgroundTexture);
    background.width = app.value.screen.width;
    background.height = app.value.screen.height;
    app.value.stage.addChild(background);

    // 러너(캐릭터) 초기화
    const runner = new Sprite(runnerTextures[0]);
    runner.x = 200;
    const gameOverLimit = 40;
    runner.y = app.value.screen.height - app.value.screen.height / 2;
    runner.scale.set(0.5);
    app.value.stage.addChild(runner);

    // 애니메이션 제어 변수 초기화
    let frame = 0;
    let frameCounter = 0;
    const frameInterval = 10; // 이미지 전환 속도
    let counterValue = 0;
    let isFalling = false;

    // 러너 애니메이션 업데이트 함수
    function updateRunnerAnimation() {
        frameCounter++;
        if (frameCounter >= frameInterval) {
            frame = (frame + 1) % runnerTextures.length;
            runner.texture = runnerTextures[frame];
            frameCounter = 0;
        }
    }

    // TM.js 초기화
    await tmInit();

    // 카운터 업데이트 함수
    async function updateCounter() {
        const newCounterValue = await getCounter();
        if (newCounterValue > counterValue && !isGameOver.value) {
            runner.x = 100 + newCounterValue * 30; // counter 값에 따라 위치 이동
        }
        counterValue = newCounterValue;
    }

    // 러너를 왼쪽으로 이동시키는 함수
    function moveRunnerLeft() {
        if (!isGameOver.value) {
            runner.x -= 1;
            if (runner.x <= gameOverLimit) {
                runner.x = gameOverLimit;
                gameOver();
            }
        }
    }

    // 게임 오버 함수
    function gameOver() {
        isGameOver.value = true;
        isFalling = true;
        runner.texture = runnerTextures[0];
    }

    // 러너가 바닥으로 떨어지는 함수
    function makeRunnerFall() {
        if (isFalling) {
            runner.y += 5;
            if (runner.y >= app.value.screen.height - runner.height) {
                runner.y = app.value.screen.height - runner.height; // 바닥에 도달하면 멈춤
            }
        }
    }

    // 러너가 오른쪽 경계에 도달했는지 확인하는 함수
    function checkRunnerRight() {
        const rightLimit = app.value.screen.width - runner.width;
        if (runner.x >= rightLimit && !isGameOver.value) {
            runner.x = rightLimit;
            success();
        }
    }

    // 성공 함수
    function success() {
        isSuccess.value = true;
        isFalling = false;
        runner.texture = runnerTextures[0];
        stopRunnerOnSuccess();
    }

    // 성공 시, 캐릭터를 멈춘다.
    function stopRunnerOnSuccess() {
        if (isSuccess.value) {
            app.value.ticker.stop();
        }
    }

    // 매 프레임마다 업데이트 로직 추가
    app.value.ticker.add(() => {
        updateCounter();
        if (!isGameOver.value && !isSuccess.value) {
            updateRunnerAnimation();
            moveRunnerLeft();
        }
        makeRunnerFall();
        checkRunnerRight();
    });
}

// 게임 시작 버튼 함수
function startGame() {
    startPixiAndTM();
}
</script>

<style scoped>
/* Pixi.js를 전체 화면으로 설정 */
#pixi-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
}

/* UI 컨테이너 */
#ui-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    position: relative;
    height: 95vh;
    gap: 10px;
}

#title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ff7043;
    background: #fff7e0;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    text-align: center;
}

#start-button {
    padding: 15px 30px;
    background-color: #ff7043;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

#start-button:hover {
    background-color: #f06292;
}

#start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
}

/* 결과 및 카운트 스타일 */
#label-container,
#counter-container {
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    color: #4b5563;
}

/* 웹캠 컨테이너 - 우측 하단 배치 */
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
}

/* GAME OVER 및 SUCCESS 오버레이 */
#game-over-overlay,
#success-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    pointer-events: none;
}

#game-over-text,
#success-text {
    font-size: 10rem;
    font-weight: bold;
    text-align: center;
    /* display: none; */
}

#game-over-text {
    color: red;
}

#success-text {
    color: green;
}
</style>