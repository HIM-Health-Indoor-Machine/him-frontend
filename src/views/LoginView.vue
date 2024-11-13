<template>
    <div class="main">
        <div class="login-container">
            <div class="login-header">
                <div class="title">HIM</div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">환영합니다!</h2>
            <p class="intro-text">HIM으로 힘을 길러보세요!</p>

            <div class="social-buttons">
                <button @click="socialLogin('Google')" class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" class="icon">
                    Google
                </button>
            </div>

            <div class="divider-text">또는 이메일로 로그인해보세요!</div>

            <form @submit.prevent="login">
                <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input type="email" v-model="email" class="input-field" placeholder="him@google.com">
                </div>
                <div class="form-group">
                    <label class="form-label">비밀번호</label>
                    <input type="password" v-model="password" class="input-field" placeholder="Password">
                </div>
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="rememberMe" class="form-checkbox">
                        <span class="checkbox-label">아이디 저장</span>
                    </label>
                    <a href="#" class="forgot-password">비밀번호를 잊어버리셨나요?</a>
                </div>
                <button type="submit" class="login-button">로그인</button>
            </form>

            <div class="footer-text">
                <span>계정이 필요하신가요? </span>
                <router-link :to="{ name: 'SignUpView' }" class="create-account-link">회원가입</router-link>
            </div>
        </div>

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const socialLogin = (platform) => {
    alert(`${platform} 로그인 기능은 아직 구현되지 않았습니다.`);
};

const login = () => {
    if (email.value && password.value) {
        alert(`환영합니다, ${email.value}! 로그인되었습니다.`);
    } else {
        alert("이메일과 비밀번호를 입력하세요.");
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
/* 전체 화면 설정 - 전역 CSS와 충돌했을 때 대비용으로 남겨두었습니다. */
/* body,
html {
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    background: linear-gradient(to bottom, #e0f7df, #c8e6c9);
    overflow: hidden;
    margin: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
} */

.main {
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    background: linear-gradient(to bottom, #e0f7df, #c8e6c9);
    overflow: hidden;
    margin: 0;
    height: 95vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    max-width: 28rem;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
}

.login-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #ff7043;
}

.subtitle {
    font-size: 1.125rem;
    font-weight: 600;
    color: #718096;
}

.welcome-message {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #ff7043;
    margin-bottom: 1rem;
}

.intro-text {
    text-align: center;
    color: #718096;
    margin-bottom: 1.5rem;
}

.social-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    transition: background-color 0.3s;
}

.social-button:hover {
    background-color: #f3f4f6;
}

.icon {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
}

.divider-text {
    text-align: center;
    color: #a0aec0;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    color: #4a5568;
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
    background-color: #ff7043;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 0.3s;
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
</style>