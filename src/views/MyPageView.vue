<template>
    <div class="mypage-container">
        <!-- 유저 정보 섹션 -->
        <section class="user-info">
            <img class="profile-pic" :src="user.profilePic" alt="프로필 사진" />
            <div class="user-details">
                <h2>{{ user.nickname }}</h2>
                <p class="user-email">{{ user.email }}</p>
                <div class="tier">
                    <span class="tier-icon">⭐</span> <!-- 티어 아이콘 -->
                    <span>티어: {{ user.tier }}</span>
                </div>
                <div class="exp-info">
                    <div class="exp-value">EXP: {{ user.exp }}/{{ user.maxExp }}</div> <!-- 경험치 표시 -->
                    <div class="exp-bar">
                        <div class="exp-bar-fill" :style="{ width: expPercent + '%' }"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 캘린더 섹션 -->
        <section class="calendar">
            <div class="calendar-header">
                <button class="month-btn" @click="prevMonth">〈</button>
                <h3>{{ currentYear }}년 {{ currentMonth }}월</h3>
                <button class="month-btn" @click="nextMonth">〉</button>
            </div>
            <div class="calendar-grid">
                <!-- 요일 표시 -->
                <div v-for="day in daysOfWeek" :key="day" class="weekday">
                    {{ day }}
                </div>
                <!-- 날짜 표시 -->
                <div v-for="day in daysInMonth" :key="day.date" class="day">
                    <span v-if="day.date">{{ day.date }}</span>
                    <div v-else style="visibility: hidden;">0</div> <!-- 빈 칸은 숨김 처리 -->
                    <div v-if="day.date" class="icon-container">
                        <div v-if="day.isCheckedIn" class="status-icon checked">✔️</div>
                        <div v-if="day.isChallengeSuccess" class="status-icon challenge">🏆</div>
                        <div v-if="day.isGameSuccess" class="status-icon game">🎮</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import exampleImage from '@/assets/images/example.jpg';

// 유저 정보
const user = ref({
    profilePic: exampleImage,
    nickname: '나는운동강아지',
    email: 'gamemaster@example.com',
    tier: 'Gold',
    exp: 2300,
    maxExp: 3000,
});

const expPercent = computed(() => (user.value.exp / user.value.maxExp) * 100);

// 캘린더 초기 설정
const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());
const daysOfWeek = ref(['일', '월', '화', '수', '목', '금', '토']);

// 각 날짜 상태 설정 (출석체크, 챌린지 성공, 게임 성공)
const daysInMonth = ref([]);

const generateCalendar = () => {
    const daysInCurrentMonth = new Date(currentYear.value, currentMonth.value, 0).getDate(); // 현재 달의 총 일 수
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1).getDay(); // 첫 번째 요일 계산 (0: 일요일, 1: 월요일, ...)

    daysInMonth.value = [];

    // 첫 요일에 맞춰 빈 칸 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysInMonth.value.push({ date: null }); // 빈 객체로 빈 칸 생성
    }

    // 날짜 추가
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        daysInMonth.value.push({
            date: i,
            isCheckedIn: Math.random() > 0.7,
            isChallengeSuccess: Math.random() > 0.8,
            isGameSuccess: Math.random() > 0.6,
        });
    }
};

const prevMonth = () => {
    if (currentMonth.value === 1) {
        currentMonth.value = 12;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
    generateCalendar();
};

const nextMonth = () => {
    if (currentMonth.value === 12) {
        currentMonth.value = 1;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
    generateCalendar();
};

onMounted(() => {
    generateCalendar();
});
</script>

<style scoped>
/* 전체 레이아웃 */
.mypage-container {
    display: flex;
    gap: 20px;
    padding: 20px;
    width: 100vw;
    height: 95vh;
    box-sizing: border-box;
    font-family: 'Comic Neue', 'Poppins', sans-serif;
    background: linear-gradient(135deg, #ffebcd, #f3e5f5);
    color: #333;
}

/* 유저 정보 섹션 */
.user-info {
    width: 250px;
    height: auto;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s ease;
    margin-top: 15px;
}

.user-info:hover {
    transform: scale(1.02);
}

.user-email {
    font-size: 0.9rem;
    color: #757575;
    margin: 5px 0;
    background: #f1f1f1;
    padding: 3px 8px;
    border-radius: 8px;
}

.tier {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1.2rem;
    color: #ffca28;
    margin-top: 8px;
    padding: 4px;
    background: rgba(255, 200, 100, 0.15);
    border-radius: 8px;
}

.tier-icon {
    font-size: 1.5rem;
}

.exp-bar {
    width: 100%;
    height: 10px;
    background: #e0e0e0;
    border-radius: 10px;
    margin-top: 5px;
    position: relative;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.exp-value {
    font-size: 0.9rem;
    font-weight: bold;
    color: #4CAF50;
    /* position: absolute;
    right: 5px;
    top: -20px; */
    background: #fff;
    padding: 2px 6px;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
}

.profile-pic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #ffab91;
    margin-bottom: 15px;
}

.user-details h2 {
    font-size: 1.4rem;
    color: #ff7043;
}

.exp-info {
    margin-top: 10px;
    width: 80%;
}

.exp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #76c7c0, #4CAF50);
    border-radius: 4px;
}

/* 캘린더 섹션 */
.calendar {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    padding: 20px;
    overflow: hidden;
    /* .calendar-grid가 .calendar 영역을 넘지 않게 함 */
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.3rem;
    color: #3f51b5;
    margin-bottom: 10px;
}

/* 캘린더 그리드 */
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(5, 1fr);
    /* 첫 번째 줄은 요일, 나머지 줄은 날짜 */
    /* grid-auto-rows: 1fr; */
    gap: 10px;
    /* 셀 간의 간격 */
    width: 100%;
    /* height: 90%; */
    flex-grow: 1;
    box-sizing: border-box;
}

/* 요일 */
.weekday {
    display: inline-block;
    /* 텍스트 높이만큼만 차지 */
    width: 100%;
    /* day의 너비와 동일하게 */
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: #ff7043;
    padding: 2px 0;
    /* 상하 padding을 줄여 높이 줄이기 */
    height: auto;
}

.day {
    width: 100%;
    /* 셀의 너비에 맞춤 */
    height: 100%;
    /* 셀의 높이에 맞춤 */
    box-sizing: border-box;
    /* 패딩과 테두리를 포함해 계산 */
    position: relative;
    padding: 0;
    border-radius: 0;
    background: #f1f8e9;
    font-size: 0.9rem;
    color: #333;
    text-align: center;
    transition: transform 0.2s ease-in-out;
}

.day:hover {
    transform: scale(1.05);
    background: #aed581;
}

.month-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #ff7043;
    cursor: pointer;
    transition: transform 0.3s;
}

.month-btn:hover {
    transform: scale(1.2);
}

.icon-container {
    display: flex;
    justify-content: space-evenly;
    margin-top: 5px;
}

.status-icon {
    font-size: 1.2rem;
}

.status-icon.checked {
    color: #4CAF50;
}

.status-icon.challenge {
    color: #FFD700;
}

.status-icon.game {
    color: #76c7c0;
}
</style>
