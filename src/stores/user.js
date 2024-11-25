import { setupAxiosInterceptors } from "@/plugins/setupAxios.js";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { getTierIcon, getNextTierIcon, getNextExp } from '@/utils/tierUtils';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
    
    const authStore = useAuthStore();
    const router = useRouter();
    const axiosInstance = setupAxiosInterceptors(authStore, router);

    const userId = ref(0);
    const userTier = ref('');
    const userExp = ref(0);
    const userTierIcon = ref('');

    const fetchUserInfo = async (userIdParam) => {

        await axiosInstance.get(`/user/${userIdParam}`)
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
            console.error("Error fetching user info:", err);
            if (err.response && err.response.status === 403) {
                console.error("다른 사용자의 데이터에 접근할 수 없습니다.");
                const userIdForRoute = localStorage.getItem("userId");
                router.push({ 
                    name: "HomeView",
                    params: { userId: userIdForRoute }
                });
            }
        })
    }

    const updateUserInfo = (userIdParam, user) => {
        axiosInstance.put(`/user/${userIdParam}`, user)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.error("Error updating user info:", err);
            if (err.response && err.response.status === 403) {
                console.error("다른 사용자의 데이터를 수정할 수 없습니다.");
                const userIdForRoute = localStorage.getItem("userId");
                router.push({ name: "HomeView", params: { userId: userIdForRoute } });
            }
        })
    }

    return {
      user,
      userId,
      userTier,
      userExp,
      userTierIcon,
      fetchUserInfo,
      updateUserInfo
    };
})