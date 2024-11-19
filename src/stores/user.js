import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { getTierIcon, getNextTierIcon, getNextExp } from '@/utils/tierUtils';

const REST_API_URL = `http://localhost:8080/api/user`;

export const useUserStore = defineStore('user', () => {
    const user = ref({
        nickname: "",
        profileImg: "",
        email: "",
        tier: "",
        curTierIcon: "",
        nextTierIcon: "",
        maxExp: 0,
        exp: 0,
    });
    const userId = ref(1);

    const fetchUserInfo = async (userId) => {
        await axios.get(`${REST_API_URL}/${userId}`)
        .then((response) => {
            user.value = response.data;
            user.value.curTierIcon = getTierIcon(user.value.tier);
            user.value.nextTierIcon = getNextTierIcon(user.value.tier);
            user.value.maxExp = getNextExp(user.value.tier);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return { user, userId, fetchUserInfo }
})