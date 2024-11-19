import axios from "axios";
import { defineStore } from "pinia"
import { computed, ref } from "vue";

const REST_API_URL = 'http://localhost:8080/api/game'

export const useGameStore = defineStore(`game`, () => {
    // states
    const gameId = ref(-1);
    const gameType = ref('');
    const gameDifficultyLevel = ref('');
    const gameUserId = ref(-1);
    const gameExpPoints = ref(0);
    const gameIsAchieved = ref(false);
    const monthlyGame = ref([]);
    const games = ref([]);

    // getters
    const typeString = computed(() => {
        return gameType.value === 'PUSHUP' ? 'Push Up' : 'Squat';
    });

    // actions
    const createGame = async (type, difficultyLevel, userId) => {

        console.log("game.js - type: " + type);
        console.log("game.js - difficultyLevel: " + difficultyLevel);
        console.log("game.js - userId: " + userId);
        gameType.value = type;
        gameDifficultyLevel.value = difficultyLevel;
        gameUserId.value = userId;

        try {
            const response = await axios.post(REST_API_URL, {
                type: gameType.value,
                difficultyLevel: gameDifficultyLevel.value,
                userId: gameUserId.value
            });
            console.log("game.js - 서버 응답: ", response.data);
            gameId.value = response.data;
        } catch (error) {
            console.error("game.js - 에러 발생: ", error);
        }
    }

    const achieveGame = async (id, isAchieved) => {
        gameId.value = id;
        gameIsAchieved.value = isAchieved;

        console.log(isAchieved);

        try {
            const response = await axios.put(REST_API_URL, {
                gameId: gameId.value,
                isAchieved: gameIsAchieved.value
            });
            console.log("game.js - 서버 응답: ", response.data);
            gameExpPoints.value = response.data;
        } catch (error) {
            console.error("game.js - 에러 발생: ", error);
        }
    }

    const fetchMonthlyGame = async (userId, year, month) => {
        await axios.get(`${REST_API_URL}/${userId}`, {
            params: { year, month }
        })
        .then((response) => {
            monthlyGame.value = response.data.map((game) => ({
                ...game
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const fetchGameList = async (userId, date) => {
        await axios.get(`${REST_API_URL}/list`, {
            params: { userId, date }
        })
        .then((response) => {
            games.value = response.data.map((game) => ({
                ...game
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return {
        gameId,
        gameType,
        gameDifficultyLevel,
        gameUserId,
        gameExpPoints,
        gameIsAchieved,
        monthlyGame,
        games,
        typeString,
        createGame,
        achieveGame,
        fetchMonthlyGame,
        fetchGameList
     }
})