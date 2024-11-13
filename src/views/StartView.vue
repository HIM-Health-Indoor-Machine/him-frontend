<template>
    <div>
        <div class="container">
            <div class="title">
                <span class="subtitle">당신에게</span> 힘 <span class="subtitle">이 되길</span>
            </div>

            <div class="title2">
                <div class="logo-container">
                    <img src="@/assets/images/logo/logo.png" alt="로고 아이콘" class="logo-icon" />
                    HIM
                </div>
                <div class="subtitle2">Health Indoor Machine</div> 
            </div>

            <div class="button-container">
                <button class="custom-button">
                    <span>시작하기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="6"
                        stroke="black">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="5" />
                    </svg>
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
import { ref, onMounted } from 'vue'


const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

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
.container {
    display: block;
    text-align: center;
    -webkit-text-stroke: 2px #000;
}

.title {
    position: relative;
    font-size: 10rem;
    font-weight: 700;
    color: #ff7043;
    margin-bottom: 3rem;
    z-index: 10;
}

.title2 {
    position: relative;
    font-size: 10rem;
    font-weight: 700;
    color: #2cca95;
    margin-bottom: 2rem;
    z-index: 10;
}

.subtitle {
    font-size: 5rem;
    font-weight: 600;
    color: #718096;
}

.subtitle2 {
    font-size: 3rem;
    font-weight: 600;
    color: #718096;
    margin-top: 1%;
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

.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5rem;
}

.custom-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px 10px;
    background-color: #ff7043; 
    border: 2px solid #000000;
    border-radius: 9999px;
    color: white;
    font-size: 4rem;
    font-weight: bold;
    cursor: pointer;
    animation: pulse 1.5s infinite;
    position: relative;
    z-index: 10;
}

.custom-button svg {
    width: 30%;
    height: 50%;
}

.custom-button span {
    margin-right: 8px;
}

.custom-button:hover {
    background: #f06292;
    transform: scale(1.05);
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
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