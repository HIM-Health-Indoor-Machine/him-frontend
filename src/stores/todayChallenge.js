import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

const REST_API_URL = `http://localhost:8080/api/today-challenge`;

export const useTodayChallengeStore = defineStore('todayChallenge', () => {
    const currentTodayChallenge = ref({
        id: null,
        cnt: null,
        challengeId: null,
        date: null,
    });

    const fetchTodayChallenge = async (challengeId, date) => {
        await axios.get(REST_API_URL, {
            params: { challengeId, date }
        })
        .then((response) => {
            currentTodayChallenge.value = response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const updateTodayChallenge = async (todayChallenge) => {
        await axios.put(REST_API_URL, todayChallenge)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return { currentTodayChallenge, fetchTodayChallenge, updateTodayChallenge }
})