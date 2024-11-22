import { setupAxiosInterceptors } from "@/plugins/setupAxios.js";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export const useChallengeStore = defineStore('challenge', () => {
    const challenges = ref([]);
    const currentChallenge = ref(null);
    
    const authStore = useAuthStore();
    const router = useRouter();
    const axiosInstance = setupAxiosInterceptors(authStore, router);

    const fetchCurrentChallenge = (challengeId) => {
        axiosInstance.get(`/challenge/${challengeId}`)
        .then((response) => {
            currentChallenge.value = response.data;
            challengeTitle.value = currentChallenge.value.title;
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const fetchChallenges = (userId, status) => {
        axiosInstance.get(`/challenge`, {
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
        axiosInstance.post(`/challenge`, challenge)
        .then((response) => {
            console.log(response);
            challenges.value.push(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const updateChallenge = (challengeId, challenge) => {
        axiosInstance.put(`/challenge/${challengeId}`, challenge)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const deleteChallenge = (challengeId) => {
        axiosInstance.delete(`/challenge/${challengeId}`)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return { challenges, currentChallenge, challengeTitle, fetchCurrentChallenge, fetchChallenges, addChallenge, updateChallenge, deleteChallenge }
})