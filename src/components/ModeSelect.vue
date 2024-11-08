<template>
    <div>
        <div id="app">
            <div class="game-container">
                <div class="settings-icon">⚙️</div>
                <div class="game-title">HIM</div>
                <div class="subtitle">Health Indoor Machine</div>
                <div class="exercise-icon">💪</div>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
                </div>
                <div class="button-container">
                    <button class="action-button" @click="increaseProgress">챌린지 모드</button>
                    <button class="action-button" @click="increaseProgress">게임 모드</button>
                </div>
            </div>

            <!-- Vue에서 관리하는 이모티콘들 -->
            <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
                :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
                {{ icon.icon }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 반응형 데이터 선언
const progressWidth = ref(0);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];
const floatingIcons = reactive([]);

// 함수 선언
const increaseProgress = () => {
    if (progressWidth.value < 100) {
        progressWidth.value += 20;
    } else {
        alert("운동 완료! 힘이 생겼습니다!");
    }
};

const createFloatingIcons = () => {
    for (let i = 0; i < 60; i++) {
        floatingIcons.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            speed: (5 + Math.random() * 5) + 's'
        });
    }
};

// 컴포넌트가 마운트되면 이모티콘 생성 함수 호출
onMounted(createFloatingIcons);
</script>

<style scoped>
/* 전체 화면 설정 */
/* body,
html {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    background: linear-gradient(to bottom, #e0f7df, #c8e6c9);
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    overflow: hidden;
    color: #333;
} */

/* 메인 컨테이너 스타일 */
.game-container {
    width: 420px;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.9);
    /* 밝고 부드러운 반투명 배경 */
    border-radius: 20px;
    /* 부드러운 모서리 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    /* 가벼운 그림자 */
    text-align: center;
    position: relative;
    z-index: 10;
}

/* HIM 로고 스타일 */
.game-title {
    font-size: 36px;
    font-weight: bold;
    color: #ff7043;
    /* 강렬한 오렌지색으로 힘을 상징 */
    margin-bottom: 10px;
    /* text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); */
}

/* 슬로건 텍스트 스타일 */
.subtitle {
    font-size: 18px;
    color: #4b5563;
    margin-bottom: 25px;
    font-weight: 600;
}

/* 버튼 컨테이너 */
.button-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

/* 버튼 스타일 */
.action-button {
    background-color: #ff7043;
    /* 부드러운 오렌지색 */
    border: none;
    color: white;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 12px;
    cursor: pointer;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
}

/* 버튼 클릭 효과 */
.action-button:active {
    transform: translateY(4px);
    box-shadow: 0 3px rgba(0, 0, 0, 0.2);
}

.action-button:hover {
    background-color: #f06292;
    /* 호버 시 핑크빛 변환 */
}

/* 진행 상태바 */
.progress-bar {
    position: relative;
    height: 20px;
    width: 100%;
    background-color: #cfcfcf;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 25px;
}

.progress-fill {
    height: 100%;
    width: 0%;
    background-color: #ff7043;
    /* 오렌지색으로 성취감 강조 */
    transition: width 0.5s;
}

/* 애니메이션 아이콘 */
.exercise-icon {
    width: 90px;
    height: 90px;
    background-color: #ff7043;
    /* 강렬한 오렌지색 */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 45px;
    color: #ffffff;
    margin: 0 auto 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    animation: pulse 1.5s infinite;
}

/* 아이콘의 펄스 효과 */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.15);
    }

    100% {
        transform: scale(1);
    }
}

/* 떠다니는 아이콘 스타일 */
.floating-icon {
    position: absolute;
    font-size: 28px;
    /* 아이콘 크기 */
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 0;
}

.settings-icon:hover {
    color: #f06292;
    /* 호버 시 핑크빛 변환 */
}

/* .settings-icon 위치 조정 */
.settings-icon {
    position: absolute;
    /* 절대 위치 설정 */
    top: 10px;
    /* 위쪽 여백 조정 */
    right: 10px;
    /* 오른쪽 여백 조정 */
    font-size: 24px;
    /* 아이콘 크기 */
    cursor: pointer;
    /* 클릭할 수 있는 커서 */
    color: #4b5563;
    /* 색상 */
    transition: color 0.3s;
    /* 색상 변환 애니메이션 */
}

/* 떠다니는 아이콘 애니메이션 */
@keyframes float {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-30px);
    }
}
</style>