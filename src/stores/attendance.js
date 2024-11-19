import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

const REST_API_URL = `http://localhost:8080/api/attendance`;

export const useAttendanceStore = defineStore('attendance', () => {
    const monthlyAttendance = ref([]);

    const setAttendanceStatus = (userId) => {
        axios.get(`${REST_API_URL}/check/${userId}`)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
    const fetchMonthlyAttendance = async (userId, year, month) => {
        await axios.get(`${REST_API_URL}/${userId}`, {
            params: { year, month }
        })
        .then((response) => {
            monthlyAttendance.value = response.data.map((attendance) => ({
                ...attendance
            }));
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return { monthlyAttendance, setAttendanceStatus, fetchMonthlyAttendance }
})