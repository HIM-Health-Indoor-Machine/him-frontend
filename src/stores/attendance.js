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