import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        email: "",
        userId: null,
        message: "",
    });

    const signupStatus = ref({
        success: false,
        message: "",
        errorType: "",
    });

    const verificationStatus = ref({
        success: false,
        message: "",
    });

    const axiosInstance = axios.create({
        baseURL: "http://54.180.5.213:8080/api",
    });

    const signUp = async (userData) => {
        try {
            await axiosInstance.post(`/auth/signup`, userData);
            signupStatus.value.success = true;
            signupStatus.value.message = "회원가입이 성공적으로 완료되었습니다!";
            signupStatus.value.errorType = "";
        } catch (err) {
            signupStatus.value.success = false;

            if (err.response?.status === 409) {
                const errorMessage = err.response.data;
                if (errorMessage.includes("닉네임")) {
                    signupStatus.value.message = "닉네임이 중복됩니다. 다른 닉네임을 입력해주세요.";
                    signupStatus.value.errorType = "nickname";
                } else if (errorMessage.includes("이메일")) {
                    signupStatus.value.message = "이메일이 중복됩니다. 다른 이메일을 입력해주세요.";
                    signupStatus.value.errorType = "email";
                }
            } else {
                signupStatus.value.message = "회원가입에 실패했습니다. 다시 시도해주세요.";
                signupStatus.value.errorType = "general";
            }
        }
    };

    const sendVerificationCode = async (email) => {
        try {
            await axiosInstance.post(`/auth/send-verification-code`, { email });
            verificationStatus.value.success = true;
            verificationStatus.value.message = "인증코드가 발송되었습니다. 이메일을 확인해주세요.";
        } catch (err) {
            verificationStatus.value.success = false;
            verificationStatus.value.message = "인증코드 발송에 실패했습니다. 다시 시도해주세요.";
        }
    };

    const verifyCode = async (email, code) => {
        try {
            await axiosInstance.post(`/auth/verify-code`, { email, code });
            verificationStatus.value.success = true;
            verificationStatus.value.message = "인증이 성공적으로 완료되었습니다.";
        } catch (err) {
            verificationStatus.value.success = false;
            verificationStatus.value.message = "인증에 실패했습니다. 다른 이메일을 사용해주세요.";
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(`/auth/login`, { email, password });
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("userId", response.data.userId);

            userInfo.value = {
                email: response.data.email,
                userId: response.data.userId,
                message: response.data.message,
            };
            console.log("로그인 성공:", response.data.message);
            return true;
        } catch (err) {
            console.error("로그인 실패:", err.response?.data?.message || "알 수 없는 오류");
            return false;
        }
    };

    const logout = async (email) => {
        try {
            await axiosInstance.post(`/auth/logout`, { email });
            console.log("로그아웃 성공");
        } catch (err) {
            console.error("로그아웃 실패:", err);
        } finally {
            localStorage.removeItem("accessToken");
            userInfo.value = {
                email: "",
                userId: null,
                message: "",
            };
            console.log("상태 초기화 완료");
        }
    };

    return {
        signupStatus,
        verificationStatus,
        axiosInstance,
        signUp,
        sendVerificationCode,
        verifyCode,
        userInfo,
        login,
        logout,
    };
});
