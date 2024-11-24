<template>
    <div>
        <div class="login-container">
            <div class="login-header">
                <div class="title">
                    <div class="logo-container">
                        <img src="/images/logo/logo.png" alt="로고 아이콘" class="logo-icon" />
                        HIM
                    </div>
                </div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">환영합니다!</h2>
            <p class="intro-text">HIM으로 힘을 길러보세요!</p>

            <form @submit.prevent="login">
                <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input type="email" v-model="email" class="input-field" placeholder="him@google.com">
                </div>
                <div class="form-group">
                    <label class="form-label">비밀번호</label>
                    <input type="password" v-model="password" class="input-field" placeholder="Password">
                </div>
                <div v-if="loginError" class="error-message">{{ loginError }}</div>
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="rememberMe" class="form-checkbox">
                        <span class="checkbox-label">아이디 저장</span>
                    </label>
                    <a href="#" class="forgot-password">비밀번호를 잊어버리셨나요?</a>
                </div>
                <button type="submit" class="login-button">로그인하기</button>
            </form>

            <div class="footer-text">
                <span>계정이 필요하신가요? </span>
                <RouterLink :to="{ name: 'SignUpView' }" class="create-account-link">회원가입</RouterLink>
            </div>
        </div>

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>


<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue'
const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loginError = ref("");

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
    if (!email.value || !password.value) {
        loginError.value = "이메일과 비밀번호를 입력하세요.";
        return;
    }

    const success = await authStore.login(email.value, password.value);
    if (success) {
        router.push({
            name: "HomeView",
            params: { userId: authStore.userInfo.userId },
        });
    } else {
        loginError.value = "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.";
    }
};

const createFloatingIcons = () => {
    for (let i = 0; i < 60; i++) {
        floatingIcons.value.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            speed: (5 + Math.random() * 5) + 's'
        });
    }
};

onMounted(() => {
    createFloatingIcons();
});
</script>

<style scoped>
.login-container {
    max-width: 28rem;
    width: 100vw;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
    transition: all 0.3s ease-in-out;
}

.login-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.title {
    font-size: 5rem;
    font-weight: 700;
    color: #2cca95;
    -webkit-text-stroke: 2px #000;
}

.subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #718096;
}

.welcome-message {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #ff7043;
}

.intro-text {
    font-size: 1.3rem;
    text-align: center;
    color: #718096;
    margin-bottom: 1.5rem;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2%;
}

.logo-icon {
    width: 30%;
}

.icon {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    color: #4a5568;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.input-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cfd8dc;
    border-radius: 0.5rem;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.input-field:focus {
    border-color: #ff7043;
    box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.2);
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.checkbox-container {
    display: flex;
    align-items: center;
}

.form-checkbox {
    height: 1rem;
    width: 1rem;
    accent-color: #ff7043;
}

.checkbox-label {
    margin-left: 0.5rem;
    color: #4a5568;
}

.forgot-password {
    color: #ff7043;
    text-decoration: none;
    cursor: pointer;
}

.forgot-password:hover {
    text-decoration: underline;
}

.login-button {
    width: 100%;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid #f3a566;
    background-color: #ff7043;
    font-size: 1.5rem;
    transition: background-color 0.3s;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    cursor: pointer;
}

.login-button:hover {
    background-color: #f06292;
}

.footer-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #718096;
}

.create-account-link {
    color: #ff7043;
    text-decoration: none;
    cursor: pointer;
}

.create-account-link:hover {
    text-decoration: underline;
}

.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 0;
}

@keyframes float {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-30px);
    }
}

.error-message {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>