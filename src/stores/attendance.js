import { setupAxiosInterceptors } from "@/plugins/setupAxios.js";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; 

export const useAttendanceStore = defineStore('attendance', () => {
    const monthlyAttendance = ref([]);

    const authStore = useAuthStore();
    const router = useRouter();
    const axiosInstance = setupAxiosInterceptors(authStore, router); 

    const setAttendanceStatus = (userId) => {
        axiosInstance.get(`/attendance/check/${userId}`)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
    const fetchMonthlyAttendance = async (userId, year, month) => {
        await axiosInstance.get(`/attendance/${userId}`, {
            params: { year, month }
        })
        .then((response) => {
            const data = response.data;
            
            if (Array.isArray(data)) {
                monthlyAttendance.value = data.map((attendance) => ({
                    ...attendance
                }));
            } else {
                console.error("Response data is not an array:", data);
                monthlyAttendance.value = [];
            }
        })
        .catch((err) => {
            console.log("Error fetching attendance:", err);
            monthlyAttendance.value = [];
        });
    };
    
    return { monthlyAttendance, setAttendanceStatus, fetchMonthlyAttendance }
})