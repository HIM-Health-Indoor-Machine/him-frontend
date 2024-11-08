<template>
    <div class="main">
        <div class="login-container">
            <div class="login-header">
                <div class="title">HIM</div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">Welcome Back!</h2>
            <p class="intro-text">Log in to start your workout journey!</p>

            <div class="social-buttons">
                <button @click="socialLogin('Google')" class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" class="icon">
                    Google
                </button>
                <button @click="socialLogin('Facebook')" class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" class="icon">
                    Facebook
                </button>
            </div>

            <div class="divider-text">or use your email</div>

            <form @submit.prevent="login">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" v-model="email" class="input-field" placeholder="Email">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" v-model="password" class="input-field" placeholder="Password">
                </div>
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="rememberMe" class="form-checkbox">
                        <span class="checkbox-label">Remember me</span>
                    </label>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" class="login-button">LOG IN</button>
            </form>

            <div class="footer-text">
                <span>Don't have an account? </span>
                <a href="#" class="create-account-link">Create an account</a>
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
    /* all: unset; */
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

/* .main {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
} */

.login-container {
    max-width: 28rem; /* max-w-md */
    width: 100%; /* w-full */
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
}

.login-header {
    text-align: center;
    margin-bottom: 1.5rem; /* mb-6 */
}

.title {
    font-size: 1.875rem; /* text-3xl */
    font-weight: 700; /* font-bold */
    color: #ff7043; /* text-orange-500 */
}

.subtitle {
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    color: #718096; /* text-gray-600 */
}

.welcome-message {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    text-align: center;
    color: #ff7043; /* text-orange-500 */
    margin-bottom: 1rem; /* mb-4 */
}

.intro-text {
    text-align: center;
    color: #718096; /* text-gray-600 */
    margin-bottom: 1.5rem; /* mb-6 */
}

.social-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem; /* space-x-4 */
    margin-bottom: 1.5rem; /* mb-6 */
}

.social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48%; /* w-1/2 */
    padding: 0.5rem; /* py-2 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    transition: background-color 0.3s;
}

.social-button:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
}

.icon {
    height: 1.25rem; /* h-5 */
    width: 1.25rem; /* w-5 */
    margin-right: 0.5rem; /* mr-2 */
}

.divider-text {
    text-align: center;
    color: #a0aec0; /* text-gray-500 */
    margin-bottom: 1rem; /* mb-4 */
}

.form-group {
    margin-bottom: 1.5rem; /* mb-6 */
}

.form-label {
    display: block;
    color: #4a5568; /* text-gray-700 */
    margin-bottom: 0.5rem; /* mb-2 */
}

.input-field {
    width: 100%; /* w-full */
    padding: 0.75rem; /* px-3 py-2 */
    border: 1px solid #cfd8dc; /* gray border */
    border-radius: 0.5rem; /* rounded-lg */
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.input-field:focus {
    border-color: #ff7043; /* border focus color */
    box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.2); /* outline */
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem; /* mb-4 */
}

.checkbox-container {
    display: flex;
    align-items: center;
}

.form-checkbox {
    height: 1rem; /* h-4 */
    width: 1rem; /* w-4 */
    accent-color: #ff7043; /* text-orange-500 */
}

.checkbox-label {
    margin-left: 0.5rem; /* ml-2 */
    color: #4a5568; /* text-gray-700 */
}

.forgot-password {
    color: #ff7043; /* text-orange-500 */
    text-decoration: none;
    cursor: pointer;
}

.forgot-password:hover {
    text-decoration: underline; /* hover:underline */
}

.login-button {
    width: 100%; /* w-full */
    color: white;
    padding: 0.5rem; /* py-2 */
    border-radius: 0.5rem; /* rounded-lg */
    background-color: #ff7043;
    font-weight: bold;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #f06292; /* hover color */
}

.footer-text {
    text-align: center;
    margin-top: 1.5rem; /* mt-6 */
    color: #718096; /* text-gray-600 */
}

.create-account-link {
    color: #ff7043; /* text-orange-500 */
    text-decoration: none;
    cursor: pointer;
}

.create-account-link:hover {
    text-decoration: underline; /* hover:underline */
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