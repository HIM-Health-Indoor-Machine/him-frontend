<template>
    <div>
        <div id="game-over-overlay" v-if="isGameOver">
            <div id="game-over-text">GAME OVER</div>
            <div id="retry-message">다시 도전하려면 아래 버튼을 눌러주세요.</div>
            <button class="retry-button" @click="retryGame">RETRY</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const gameStarted = ref(false);
const isGameOver = ref(true);

const retryGame = () => {
    isGameOver.value = false;
    gameStarted.value = false;
    console.log("Game restarted!");
};
</script>

<style scoped>
#game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 100;
    color: white;
    text-align: center;
}

#game-over-text {
    font-size: 6rem;
    font-weight: bold;
    color: #ff3b3b;
    text-shadow: 0px 0px 10px rgba(255, 0, 0, 0.8);
    animation: shake 0.5s ease-in-out infinite alternate, fadeIn 1.5s ease-in-out;
}

#retry-message {
    font-size: 1.5rem;
    margin-top: 20px;
    color: #ff8080;
    animation: fadeIn 1.5s ease-in-out;
}

@keyframes shake {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(-5px, 0);
    }

    50% {
        transform: translate(5px, 0);
    }

    75% {
        transform: translate(-5px, 0);
    }

    100% {
        transform: translate(0, 0);
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

.retry-button {
    margin-top: 30px;
    padding: 15px 30px;
    background-color: #ff3b3b;
    border: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
}

.retry-button:hover {
    background-color: #ff7070;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}
</style>