<template>
  <div>
    <div id="game-over-overlay">
      <div id="game-over-text">GAME OVER</div>
      <div class="game-info">
        <p>운동 종류: {{ gameType === 'PUSHUP' ? 'Push Up' : 'Squat' }}</p>
        <div>난이도: {{ gameDifficultyLevel }}</div>
      </div>
      <div id="retry-message">다시 도전하려면 아래 버튼을 눌러주세요.</div>
      <button class="retry-button" @click="retryGame">다시하기</button>
      <button class="new-challenge-button" @click="newGame">새로운 게임하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const gameId = route.params.id;
const gameType = ref('');
gameType.value = route.params.type;
const gameDifficultyLevel = ref('')
gameDifficultyLevel.value = route.params.difficultyLevel;
const gameTheme = route.params.theme;
const userId = route.params.userId;

const newGame = () => {
  router.push({ name: 'GameSelectView' });
};

const retryGame = () => {
  router.push({
    name: "GamePlayView",
    params: {
      id: gameId,
      type: gameType.value,
      difficultyLevel: gameDifficultyLevel.value,
      theme: gameTheme,
      userId: userId
    }
  });
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
  transition: all 0.3s ease-in-out;
}

#game-over-text {
  font-size: 8rem;
  font-weight: bold;
  color: #ff3b3b;
  text-shadow: 0px 0px 10px rgba(255, 0, 0, 0.8);
  animation: shake 0.5s ease-in-out infinite alternate, fadeIn 1.5s ease-in-out;
}

.game-info {
    font-size: 1.5rem;
    color: #aaaaaa;
    text-align: center;
}

#retry-message {
  font-size: 1.5rem;
  margin-top: 30px;
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
  font-family: 'HakgyoansimDunggeunmisoTTF-B';
  margin-top: 40px;
  padding: 20px 40px;
  background-color: #ff3b3b;
  border: none;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
  animation: jittery 4s infinite;
}

.retry-button:hover {
  background-color: #ff7070;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.new-challenge-button {
  font-family: 'HakgyoansimDunggeunmisoTTF-B';
  margin-top: 80px;
  padding: 20px 40px;
  background-color: #4CAF50;
  border: none;
  color: white;
  font-size: 2rem;
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

@keyframes jittery {

  5%,
  50% {
    transform: scale(1);
  }

  10% {
    transform: scale(0.9);
  }

  15% {
    transform: scale(1.15);
  }

  20% {
    transform: scale(1.15) rotate(-5deg);
  }

  25% {
    transform: scale(1.15) rotate(5deg);
  }

  30% {
    transform: scale(1.15) rotate(-3deg);
  }

  35% {
    transform: scale(1.15) rotate(2deg);
  }

  40% {
    transform: scale(1.15) rotate(0);
  }
}
</style>