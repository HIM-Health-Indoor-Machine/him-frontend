<template>
    <div class="main">
        <div class="signup-container">
            <div class="text-center mb-6">
                <div class="title">HIM</div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">Create an Account</h2>
            <p class="intro-text">Join us and start your fitness journey today!</p>

            <form>
                <div class="form-group-horizontal">
                    <input type="text" placeholder="First Name" class="input-field half-width">
                    <input type="text" placeholder="Last Name" class="input-field half-width">
                </div>
                <div class="form-group">
                    <input type="email" placeholder="Email" class="input-field full-width">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="Enter a strong password" class="input-field full-width">
                </div>
                <div class="form-options">
                    <input type="checkbox" id="terms" class="form-checkbox">
                    <label for="terms" class="terms-label">I agree to the <a href="#" class="link">Terms &
                            Conditions</a></label>
                </div>
                <button type="submit" class="signup-button">SIGN UP</button>
            </form>

            <p class="social-text">Or sign up using</p>
            <div class="social-buttons">
                <button class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" class="icon">
                </button>
                <button class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" class="icon">
                </button>
                <button class="social-button">
                    <img src="https://img.icons8.com/color/48/000000/twitter.png" alt="Twitter" class="icon">
                </button>
            </div>
        </div>

        <!-- Floating icons -->
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
/* body, html {
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
