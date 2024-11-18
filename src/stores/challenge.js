import axios from "axios";
import { defineStore } from "pinia";
import {ref} from 'vue';

const REST_API_URL = `http://localhost:8080/api/challenge`;

export const useChallengeStore = defineStore('challenge', () => {
    const challenges = ref([]);
    const currentChallenge = ref(null);

    const fetchCurrentChallenge = (challengeId) => {
        axios.get(`${REST_API_URL}/${challengeId}`)
        .then((response) => {
            currentChallenge.value = response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return { challenges, currentChallenge, fetchCurrentChallenge }
    const fetchChallenges = (userId, status) => {
        axios.get(REST_API_URL, {
            params: { userId, status }
        })
        .then((response) => {
            challenges.value = response.data.map((challenge) => ({
                ...challenge,
                icon: challenge.type === "PUSHUP" ? "💪" : 
                      challenge.type === "SQUAT" ? "🏋️‍♂️" : "❓"
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return { challenges, currentChallenge, fetchCurrentChallenge, fetchChallenges}
})