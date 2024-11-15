<template>
    <div>
        <div class="signup-container">
            <div class="login-header">
                <div class="title">
                    <div class="logo-container">
                        <img src="@/assets/images/logo/logo.png" alt="로고 아이콘" class="logo-icon" />
                        HIM
                    </div>
                </div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">환영합니다!</h2>
            <p class="intro-text">HIM으로 힘을 길러보세요!</p>

            <div class="divider-text">소셜 로그인도 가능합니다!</div>

            <div class="social-buttons">
                <button @click="socialLogin('Google')" class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" class="icon">
                    Google
                </button>
            </div>

            <form @submit.prevent="signUp">
                <div class="form-group">
                    <label class="form-label">이름</label>
                    <input type="name" v-model="password" class="input-field" placeholder="Password">
                </div>
                <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input type="email" v-model="email" class="input-field" placeholder="him@google.com">
                </div>
                <div class="form-group">
                    <label class="form-label">비밀번호</label>
                    <input type="password" v-model="password" class="input-field" placeholder="Password">
                </div>
                <div class="form-group">
                    <label class="form-label">비밀번호 재입력</label>
                    <input type="passwordRetype" v-model="password" class="input-field" placeholder="Password">
                </div>
                
                <button type="submit" class="signup-button">회원가입하기</button>
            </form>
        </div>

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordRetype = ref('');
const rememberMe = ref(false);
const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const signUp = () => {
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
.signup-container {
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

.form-checkbox {
    height: 1rem;
    width: 1rem;
    margin-right: 0.5rem;
}

.terms-label {
    color: #4a5568;
}

.link {
    color: #ff7043;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}

.signup-button {
    width: 100%;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ff7043;
    border: 2px solid #f3a566;
    font-weight: bold;
    font-size: 1.5rem;
    transition: background-color 0.3s;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    cursor: pointer;
}

.signup-button:hover {
    background-color: #f06292;
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
    font-size: 1rem;
    transition: background-color 0.3s;
    color: #718096;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    cursor: pointer;
}

.social-button:hover {
    background-color: #d5d5df;
}

.divider-text {
    text-align: center;
    color: #a0aec0;
    margin-bottom: 1rem;
}

.icon {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
}

.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 1;
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
