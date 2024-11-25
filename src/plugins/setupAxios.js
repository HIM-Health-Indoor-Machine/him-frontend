import axios from "axios";

export const setupAxiosInterceptors = (authStore, router) => {

    const instance = axios.create({
        baseURL: "http://54.180.5.213:8080/api",
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            } else {
                console.warn("accessToken이 없습니다.");
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            const newAccessToken = response.headers["new-access-token"];
            if (newAccessToken) {
                localStorage.setItem("accessToken", newAccessToken);
                console.log("새로운 Access Token이 업데이트되었습니다:", newAccessToken);
            }
            return response;
        },
        async (error) => {
            if (error.response?.status === 401) {
                console.warn("토큰이 만료되었습니다. StartView로 이동합니다.");
                authStore.logout();
                await router.push({ name: "StartView" });
            }
            return Promise.reject(error);
        }
    );
    
    return instance;
};
