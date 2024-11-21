import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

const REST_API_URL = `http://localhost:8080/api/challenge`;

export const useChallengeStore = defineStore('challenge', () => {
    const challenges = ref([]);
    const currentChallenge = ref(null);

    const challengeTitle = ref('');

    const fetchCurrentChallenge = async (challengeId) => {
        await axios.get(`${REST_API_URL}/${challengeId}`)
        .then((response) => {
            currentChallenge.value = response.data;
            challengeTitle.value = currentChallenge.value.title;
        })
        .catch((err) => {
            console.log(err);
        })
    }

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

    const addChallenge = (challenge) => {
        axios.post(REST_API_URL, challenge)
        .then((response) => {
            console.log(response);
            challenges.value.push(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const updateChallenge = (challengeId, challenge) => {
        axios.put(`${REST_API_URL}/${challengeId}`, challenge)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const deleteChallenge = (challengeId) => {
        axios.delete(`${REST_API_URL}/${challengeId}`)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return { challenges, currentChallenge, challengeTitle, fetchCurrentChallenge, fetchChallenges, addChallenge, updateChallenge, deleteChallenge }
})