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
    const userTier = ref('');
    const userExp = ref(0);
    const userTierIcon = ref('');

    const fetchUserInfo = async (userId) => {
        await axios.get(`${REST_API_URL}/${userId}`)
        .then((response) => {
            user.value = response.data;
            user.value.curTierIcon = getTierIcon(user.value.tier);
            user.value.nextTierIcon = getNextTierIcon(user.value.tier);
            user.value.maxExp = getNextExp(user.value.tier);
            userTier.value = user.value.tier;
            userExp.value = user.value.exp;
            userTierIcon.value = user.value.curTierIcon;
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const updateUserInfo = (userId, user) => {
        axios.put(`${REST_API_URL}/${userId}`, user)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return { user, userId, userTier, userExp, userTierIcon, fetchUserInfo, updateUserInfo }
})