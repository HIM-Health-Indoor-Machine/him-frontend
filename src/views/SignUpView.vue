<template>
    <div class="main">
        <div class="signup-container">
            <div class="text-center mb-6">
                <div class="title">HIM</div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">회원가입</h2>
            <p class="intro-text">HIM은 당신에게 힘이 되기 위해 노력합니다!</p>

            <form>
                <div class="form-group-horizontal">
                    <input type="text" placeholder="이름" class="input-field half-width">
                </div>
                <div class="form-group">
                    <input type="email" placeholder="이메일" class="input-field full-width">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="비밀번호를 입력해주세요." class="input-field full-width">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="비밀번호를 다시 입력해주세요." class="input-field full-width">
                </div>
                <button type="submit" class="signup-button">회원가입</button>
            </form>

            <p class="social-text">또는 구글 로그인도 가능합니다!</p>
            <div class="social-buttons">
                <button class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" class="icon">
                </button>
            </div>
        </div>

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];


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

.signup-container {
    max-width: 28rem;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
}

.title {
    text-align: center;
    font-size: 1.875rem;
    font-weight: 700;
    color: #ff7043;
}

.subtitle {
    text-align: center;
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

.form-group-horizontal {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
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
    align-items: center;
    margin-bottom: 1rem;
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
    border: 1px solid #ff7043;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.signup-button:hover {
    background-color: #f06292;
}

.social-text {
    text-align: center;
    color: #718096;
    margin-top: 1.5rem;
}

.social-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.social-button {
    background-color: #e2e8f0;
    border: 1px solid #e2e8f0;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.social-button:hover {
    background-color: #cbd5e0;
}

.icon {
    height: 1.5rem;
    width: 1.5rem;
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
