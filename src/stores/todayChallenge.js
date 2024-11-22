import { setupAxiosInterceptors } from "@/plugins/setupAxios.js";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export const useTodayChallengeStore = defineStore('todayChallenge', () => {
    const monthlyTodayChallenge = ref([]);
    const currentTodayChallenge = ref({
        id: null,
        cnt: 0,
        challengeId: null,
        date: null,
    });
    const todayChallenges = ref([]);

    const router = useRouter();
    const authStore = useAuthStore();
    const axiosInstance = setupAxiosInterceptors(authStore, router);

    const fetchTodayChallenge = async (challengeId, date) => {
        await axiosInstance.get(`/today-challenge`, {
            params: { challengeId, date }
        })
        .then((response) => {
            currentTodayChallenge.value = response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const fetchTodayChallengeList = async (userId, date) => {
        await axiosInstance.get(`/today-challenge/list`, {
            params: { userId, date }
        })
        .then((response) => {
            todayChallenges.value = response.data.map((todayChallenge) => ({
                ...todayChallenge
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const updateTodayChallenge = async (todayChallenge) => {
        await axiosInstance.put(`/today-challenge`, todayChallenge)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const fetchMonthlyTodayChallenge = async (userId, year, month) => {
        await axiosInstance.get(`/today-challenge/${userId}`, {
            params: { year, month }
        })
        .then((response) => {
            monthlyTodayChallenge.value = response.data.map((todayChallenge) => ({
                ...todayChallenge
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return { monthlyTodayChallenge, currentTodayChallenge, todayChallenges, fetchTodayChallenge, fetchTodayChallengeList, updateTodayChallenge, fetchMonthlyTodayChallenge }
})