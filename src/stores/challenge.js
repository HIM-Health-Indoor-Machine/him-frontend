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
})