import { setupAxiosInterceptors } from "@/plugins/setupAxios.js";
import { defineStore } from "pinia"
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export const useGameStore = defineStore(`game`, () => {
    const gameId = ref(-1);
    const gameType = ref('');
    const gameDifficultyLevel = ref('');
    const gameUserId = ref(-1);
    const gameExpPoints = ref(0);
    const gameIsAchieved = ref(false);
    const monthlyGame = ref([]);
    const games = ref([]);

    const authStore = useAuthStore();
    const router = useRouter();
    const axiosInstance = setupAxiosInterceptors(authStore, router);

    const createGame = async (type, difficultyLevel, userId) => {

        gameType.value = type;
        gameDifficultyLevel.value = difficultyLevel;
        gameUserId.value = userId;

        try {
            const response = await axiosInstance.post(`/game`, {
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

        try {
            const response = await axiosInstance.put(`/game`, {
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
        await axiosInstance.get(`/game/${userId}`, {
            params: { year, month }
        })
        .then((response) => {
            const data = response.data;
    
            if (Array.isArray(data)) {
                monthlyGame.value = data.map((game) => ({
                    ...game
                }));
            } else {
                console.error("Response data is not an array:", data);
                monthlyGame.value = [];
            }
        })
        .catch((err) => {
            console.log("Error fetching games:", err);
            monthlyGame.value = [];
        });
    };
    

    const fetchGameList = async (userId, date) => {
        await axiosInstance.get(`/game/list`, {
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
        createGame,
        achieveGame,
        fetchMonthlyGame,
        fetchGameList
     }
})