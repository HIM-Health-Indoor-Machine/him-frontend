<template>
    <div>
        <div class="main-container">
            <div class="header-container">
                <span class="header">Challenge Selection</span>
            </div>
            <div class="challenge-container">
                <div v-for="(challenge, index) in challenges" :key="index" class="challenge-box">
                    <div class="challenge-info">{{ challenge.icon }} {{ challenge.name }}</div>
                    <div class="challenge-info">⏰ {{ challenge.date }}</div>
                    <div class="challenge-info">🎯 목표: {{ challenge.goal }}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: challenge.progress + '%' }"></div>
                    </div>
                </div>
                <div v-if="!isCreating" @click="toggleForm" class="challenge-box new-challenge-box expand">
                    <div>+</div>
                    <div></div>
                </div>
                <div v-if="isCreating" class="challenge-box new-challenge-form open">
                    <form @submit.prevent="saveChallenge">
                        <div class="challenge-info">
                            <label style="text-align: center;">운동 타입</label>
                            <div style="display: flex; justify-content: space-around; align-items: center;">
                                <label>
                                    <input type="radio" v-model="newChallenge.type" value="Push Up">
                                    💪 Push Up
                                </label>
                                <label>
                                    <input type="radio" v-model="newChallenge.type" value="Squat">
                                    🏋️‍♂️ Squat
                                </label>
                            </div>
                        </div>
                        <div class="challenge-info">
                            <label>⏰ 종료 날짜</label>
                            <input type="date" v-model="newChallenge.date" class="input-field">
                        </div>
                        <div class="challenge-info">
                            <label>🎯 하루 목표 갯수</label>
                            <input type="number" v-model="newChallenge.goal" class="input-field" placeholder="예: 30">
                        </div>
                        <div class="button-container">
                            <button type="submit" class="action-button">저장</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const challenges = ref([
    { name: "Push Up", icon: "💪", date: "2023-12-31", goal: 30, progress: 60 },
    { name: "Squat", icon: "🏋️‍♂️", date: "2024-01-15", goal: 20, progress: 40 }
]);
const isCreating = ref(false);
const newChallenge = reactive({ type: "Push Up", date: "", goal: null });
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];
const floatingIcons = ref([]);

// 함수 선언
const toggleForm = () => {
    isCreating.value = !isCreating.value;
};

const saveChallenge = () => {
    if (newChallenge.date && newChallenge.goal) {
        challenges.value.push({
            name: newChallenge.type,
            icon: newChallenge.type === "Push Up" ? "💪" : "🏋️‍♂️",
            date: newChallenge.date,
            goal: newChallenge.goal,
            progress: 0
        });
        resetForm();
    } else {
        alert("날짜와 목표를 입력해주세요.");
    }
};

const resetForm = () => {
    newChallenge.type = "Push Up";
    newChallenge.date = "";
    newChallenge.goal = null;
    isCreating.value = false;
};

const addFloatingIcons = () => {
    for (let i = 0; i < 60; i++) {
        floatingIcons.value.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            top: Math.random() * 100 + "vh",
            left: Math.random() * 100 + "vw",
            speed: (5 + Math.random() * 5) + "s"
        });
    }
};

// 컴포넌트가 마운트될 때 아이콘 생성
onMounted(addFloatingIcons);
</script>

<style scoped>
/* 전체 화면 설정 */
/* html, body {
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

/* 메인 컨테이너 설정 */
.main-container {
    display: flex;
    flex-direction: column;
    /* 세로 배치 */
    align-items: center;
    gap: 10px;
    /* 헤더와 챌린지 박스 간격 */
}

/* 메인 컨테이너 */
.challenge-container {
    display: flex;
    gap: 20px;
    padding: 2rem;
    position: relative;
    /* 추가 */
    z-index: 1;
    /* 추가 */
    max-width: 80vw;
    /* 화면 너비의 90%로 설정 */
    overflow-x: auto;
    /* 가로 스크롤 활성화 */
    white-space: nowrap;
    /* 카드들이 한 줄로 정렬되도록 설정 */
    scroll-behavior: smooth;
    /* 스크롤을 부드럽게 설정 */
}

/* 스크롤 바 스타일 (선택 사항) */
.challenge-container::-webkit-scrollbar {
    height: 8px;
}

.challenge-container::-webkit-scrollbar-thumb {
    background-color: #ff7043;
    border-radius: 4px;
}

.challenge-container::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

/* 공통 챌린지 박스 스타일 */
.challenge-box {
    width: 220px;
    /* 가로 폭을 넓게 조정 */
    height: 280px;
    /* 세로 길이를 넓게 조정 */
    flex-shrink: 0;
    /* 크기 고정 */
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 1rem;
    /* 내부 여백을 줄여서 내용이 더 꽉 차게 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;
}

/* 챌린지 박스 내 텍스트 스타일 */
.challenge-info {
    font-size: 25px;
    /* 텍스트 크기를 키움 */
    line-height: 3;
    /* 줄 간격을 넓힘 */
    margin: 8px 0;
    /* 간격을 줄여서 내용이 가득 찬 느낌 */
}

/* 프로그레스 바 여백 조정 */
.progress-bar {
    height: 12px;
    width: 100%;
    background-color: #cfcfcf;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 8px;
    /* 여백 조정 */
}

.challenge-box:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 헤더 컨테이너 수정 */
.header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    z-index: 10;
}

/* 헤더 스타일 */
.header {
    font-size: 40px;
    font-weight: bold;
    color: #ff7043;
    padding: 8px 20px;
    background: rgba(255, 230, 204, 0.9);
    border-radius: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    z-index: 10;
}

@keyframes floatIcons {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-10px);
    }
}

.progress-fill {
    height: 100%;
    width: 60%;
    /* 진행도를 표시할 비율 (예시) */
    background-color: #ff7043;
    animation: fillProgress 1s forwards;
}

/* 새로운 챌린지 생성 박스 스타일 */
.new-challenge-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #ff7043;
    cursor: pointer;
    animation: pulse 1.5s infinite;
}

/* "+" 기호의 스타일 */
.new-challenge-box div:first-child {
    font-size: 100px;
    /* 크기 증가 */
    font-weight: 700;
    /* 두껍게 */
    color: #ff7043;
    /* 버튼 색상 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    /* 그림자 효과 */
    transition: transform 0.3s, color 0.3s;
    /* 변환 효과 */
}

/* "+" 기호에 마우스 호버 시 효과 */
.new-challenge-box:hover div:first-child {
    transform: scale(1.2);
    /* 약간 확대 */
    color: #f06292;
    /* 호버 시 색상 변경 */
}

/* 새 텍스트 스타일 */
.new-challenge-box div:last-child {
    margin-top: 8px;
    font-size: 18px;
    color: #4b5563;
    font-weight: 500;
}

/* .new-challenge-form 스타일 조정 */
.new-challenge-form {
    background-color: rgba(255, 245, 238, 0.9);
    border: 2px dashed #ff7043;
    padding: 1rem;
    font-size: 14px;
    line-height: 1.4;
    overflow: hidden;
    /* 내부 요소가 컨테이너 밖으로 나가지 않도록 */
    display: flex;
    flex-direction: column;
    /* 아래로 요소가 쌓이도록 설정 */
    gap: 8px;
    /* 입력 요소 사이의 여백 */
}

/* .challenge-info의 폰트 크기와 줄 간격을 기본 폼에 맞게 조정 */
.new-challenge-form .challenge-info {
    font-size: 14px;
    /* 폰트 크기 줄이기 */
    line-height: 2;
    /* 줄 간격 줄이기 */
    margin: 8px 0;
    /* 간격 조정 */
}

/* 챌린지 박스 내 challenge-info 스타일 */
.challenge-info {
    display: flex;
    flex-direction: column;
    /* 수직 정렬 */
    align-items: flex-start;
    /* 왼쪽 정렬 */
}

/* 인풋 및 라디오 버튼 스타일 조정 */
.new-challenge-form label,
.new-challenge-form input[type="radio"]+label,
.new-challenge-form input,
.new-challenge-form button {
    font-size: 14px;
}

.new-challenge-form form {
    border: none;
    /* 내부 테두리 제거 */
    padding: 3;
    margin: 0;
    /* margin-left: -10px; */
}


/* 떠다니는 이모티콘 스타일 */
.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 0;
}

/* 챌린지 생성 카드의 입력 필드 스타일 */
.input-field {
    width: 90%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
}

/* 부모 div를 가운데 정렬 및 상단 여백 조정 */
.button-container {
    display: flex;
    justify-content: center;
    margin-top: -20px;
    /* 버튼이 더 위로 올라가도록 조정 */
}

/* 버튼 스타일 */
.action-button {
    background-color: #ff7043;
    border: none;
    color: white;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 10px;
    cursor: pointer;
    width: 80%;
    /* 버튼의 가로폭을 조절 */
    transition: background-color 0.3s;
    margin-top: 10px;
    margin-left: 10px;
    /* 오른쪽으로 살짝 이동 (값은 조정 가능) */
}

.action-button:hover {
    background-color: #f06292;
}

/* 떠다니는 애니메이션 */
@keyframes float {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-30px);
    }
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

@keyframes fillProgress {
    to {
        width: 75%;
    }

    /* 임의 진행도 */
}

/* 펼쳐지는 애니메이션 */
@keyframes expandAnimation {
    from {
        transform: scaleY(0);
        opacity: 0;
    }

    to {
        transform: scaleY(1);
        opacity: 1;
    }
}

/* 애니메이션 초기 설정 */
.expand {
    animation: expandAnimation 0.3s ease-out forwards;
    transform-origin: top;
    opacity: 0;
}

/* 책을 펼치듯이 열리는 애니메이션 */
@keyframes openCard {
    from {
        transform: rotateY(-90deg);
        /* Y축 기준 회전 시작 */
        opacity: 0;
    }

    to {
        transform: rotateY(0);
        /* 정면으로 펼쳐짐 */
        opacity: 1;
    }
}

/* 애니메이션 클래스 */
.open {
    animation: openCard 0.5s ease-out forwards;
    /* 애니메이션 적용 */
    transform-origin: left;
    /* 왼쪽에서 시작하는 펼침 */
    opacity: 0;
}
</style>