<template>
    <div class="mypage-container">

        <div class="box user-info">
            <div class="user-details">
                <h2 class="nickname">{{ user.nickname }}</h2>

                <div class="profile-pic-wrapper">
                    <img class="profile-pic" :src="user.profilePic" alt="프로필 사진" />
                    <button class="setting-button" aria-label="사진 선택">
                        <img src="@/assets/images/icon/setting-icon.png" alt="사진 선택 아이콘" class="setting-icon" />
                    </button>
                </div>
                <p class="user-email">{{ user.email }}</p>
            </div>

            <div class="exp-info-container">
                <div class="exp-card">
                    <h5 class="info-section">
                        승급 필요 경험치
                    </h5>
                    <div class="highlight">700 exp</div>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        오늘 경험치
                    </h5>
                    <div class="highlight positive">26 exp</div> <span class="text-muted">/ 51 exp</span>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        챌린지 경험치
                    </h5>
                    <ul class="list-unstyled">
                        <li class="list pending">챌린지 1: 5 exp</li>
                        <li class="list completed">챌린지 2: 5 exp</li>
                        <li class="list completed">챌린지 3: 5 exp</li>
                    </ul>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        게임 경험치
                    </h5>
                    <ul class="list-unstyled">
                        <li class="list completed">Easy: 5 exp</li>
                        <li class="list completed">Medium: 10 exp</li>
                        <li class="list pending">Hard: 20 exp</li>
                    </ul>
                </div>

                <div class="exp-card">
                    <h5 class="info-section penalty">
                        패널티 경험치
                    </h5>
                    <div class="penalty-highlight">-113 exp</div>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        보너스 경험치
                    </h5>
                    <div class="highlight time-remaining">10 exp (D-day 4)</div>
                    <div class="highlight time-remaining">100 exp (D-day 26)</div>
                </div>
            </div>
        </div>

        <div class="right-section">
            <div class="top-section">
                <div class="box tier-container">
                    <div class="tier">
                        <div class="tier-pic-wrapper">
                            <img class="tier-pic" :src="user.curTierIcon" alt="현재 티어 사진" />
                            <button @click="toggleRankings" class="info-button" aria-label="티어 설명">
                                <img src="@/assets/images/icon/heart-icon.png" alt="티어 설명 아이콘" class="heart-icon" />
                            </button>
                        </div>
                        <span>{{ user.tier }}</span>
                    </div>

                    <div class="exp-tier-container">
                        <img class="exp-tier-pic" :src="user.curTierIcon" alt="현재 티어 사진" />
                        <div class="exp-bar-container">
                            <div class="exp-bar-fill" :style="{ width: expFilledBarWidth + '%' }"></div>
                            <div class="exp-text">{{ user.exp }} / {{ user.maxExp }} exp</div>
                        </div>
                        <img class="exp-tier-pic" :src="user.nextTierIcon" alt="다음 티어 사진" />
                    </div>
                </div>

                <div :class="['overlay', { show: showRankings }]" @click="toggleRankings"></div>

                <div v-if="showRankings" :class="['rankings-container', { show: showRankings }]">
                    <table class="tier-table">
                        <tbody>
                            <tr class="tier-info-row">
                                <td colspan="5" class="tier-info">티어 정보</td>
                            </tr>
                            <template v-for="(row, rowIndex) in tierRows" :key="`row-${rowIndex}`">
                                <tr class="tier-row">
                                    <td v-for="tier in row" :key="`title-${tier}`" class="tier-cell">
                                        <h2 class="tier-title">{{ tier }}</h2>
                                    </td>
                                </tr>

                                <tr>
                                    <td v-for="tier in row" :key="`image-${tier}`" class="tier-cell">
                                        <img :class="['image-box', tierClass(tier)]" :src="tierImages[tier]"
                                            :alt="`${tier} 티어 이미지`" />
                                    </td>
                                </tr>

                                <tr class="spacer-row" v-if="rowIndex < tierRows.length - 1">
                                    <td :colspan="row.length"></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>

                <div class="box3-and-buttons">
                    <div class="box box3">박스3</div>

                    <div class="button-container">
                        <button @click="startChallenge" class="custom-button">
                            <span>🏆 챌린지 하기</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button @click="startGame" class="custom-button">
                            <span>🎮 게임 하기</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="box calendar">
                <div class="calendar-header">
                    <button class="month-btn" @click="prevMonth">〈</button>
                    <h3 style="color: #ff7043;">{{ currentYear }}년 {{ currentMonth }}월</h3>
                    <button class="month-btn" @click="nextMonth">〉</button>
                </div>
                <div class="calendar-grid">
                    <div v-for="day in daysOfWeek" :key="day" class="weekday">
                        {{ day }}
                    </div>
                    <div v-for="day in daysInMonth" :key="day.date" class="day">
                        <span v-if="day.date">{{ day.date }}</span>
                        <div v-else style="visibility: hidden;">0</div>
                        <div v-if="day.date" class="icon-container">
                            <div v-if="day.isCheckedIn" class="status-icon checked">✔️</div>
                            <div v-if="day.isChallengeSuccess" class="status-icon challenge">🏆</div>
                            <div v-if="day.isGameSuccess" class="status-icon game">🎮</div>
                        </div>
                    </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import exampleImage from '@/assets/images/character/example.jpg';

import ironImage from '@/assets/images/tier/tier_IRON.png';
import bronzeImage from '@/assets/images/tier/tier_BRONZE.png';
import silverImage from '@/assets/images/tier/tier_SILVER.png';
import goldImage from '@/assets/images/tier/tier_GOLD.png';
import platinumImage from '@/assets/images/tier/tier_PLATINUM.png';
import emeraldImage from '@/assets/images/tier/tier_EMERALD.png';
import diamondImage from '@/assets/images/tier/tier_DIAMOND.png';
import masterImage from '@/assets/images/tier/tier_MASTER.png';
import legendImage from '@/assets/images/tier/tier_LEGEND.png';
import goatImage from '@/assets/images/tier/tier_GOAT.png';

const router = useRouter();

const showRankings = ref(false);
const tierImages = {
    IRON: ironImage,
    BRONZE: bronzeImage,
    SILVER: silverImage,
    GOLD: goldImage,
    PLATINUM: platinumImage,
    EMERALD: emeraldImage,
    DIAMOND: diamondImage,
    MASTER: masterImage,
    LEGEND: legendImage,
    GOAT: goatImage,
};

const tierRows = [
    ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    ['EMERALD', 'DIAMOND', 'MASTER', 'LEGEND', 'GOAT']
];

const tierClass = (tier) => {
    return `tier-${tier.toLowerCase()}`;
};

const toggleRankings = () => {
    showRankings.value = !showRankings.value;
};


const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️",
    "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const user = ref({
    profilePic: exampleImage,
    nickname: '나는운동강아지',
    email: 'gamemaster@example.com',
    tier: 'IRON',
    curTierIcon: ironImage,
    nextTierIcon: bronzeImage,
    exp: 2300,
    maxExp: 3000,
});

const expValue = ref(0)
const expFilledBarWidth = ref(0);

const increaseExp = () => {
    let interval = setInterval(() => {
        if (expValue.value < user.value.exp) {
            expValue.value += 10;
        } else {
            clearInterval(interval);
        }
    }, 10);
};

watch(expValue, (newVal) => {
    expFilledBarWidth.value = (newVal / user.value.maxExp) * 100;
});

const startChallenge = () => {
  router.push({ name: 'ChallengeSelectView' });
};
const startGame = () => {
  router.push({ name : 'GameSelectView' })  
};

const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());
const daysOfWeek = ref(['일', '월', '화', '수', '목', '금', '토']);

const daysInMonth = ref([]);

const generateCalendar = () => {
    const daysInCurrentMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();

    daysInMonth.value = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        daysInMonth.value.push({ date: null });
    }

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

onMounted(() => {
    addFloatingIcons()
    generateCalendar();
    increaseExp();
});
</script>

<style scoped>
.mypage-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
    background: linear-gradient(to bottom, #e0f7df, #c8e6c9);
    color: #333;
    position: relative;
    transition: all 0.3s ease-in-out;
}

/* ===================================================== */
.box {
    border: 2px solid white;
    background-color: #333;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    transition: all 0.3s ease-in-out;
}

/* ===================================================== */


/* 유저 정보 */
.user-info {
    flex: 0.4;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, width 0.3s ease;
    z-index: 10;
    position: relative;
    overflow: hidden;
    gap: 50px;
    transition: all 0.3s ease-in-out;
}

.user-email {
    display: flex;
    font-size: 1rem;
    color: #757575;
    margin: 0;
    border-radius: 8px;
    justify-content: center;
}

.profile-pic-wrapper {
    position: relative;
    display: inline-block;
}

.profile-pic {
    width: 35%;
    border-radius: 50%;
    border: 3px solid #ffab91;
    margin-bottom: 5px;
    margin-top: 5px;
}

.setting-button {
    position: absolute;
    top: 5%;
    right: 25%;
    background: none;
    border: none;
    cursor: pointer;
    box-shadow: none;
    padding: 4px;
}

.setting-icon {
    width: 80%;
}

.user-details h2 {
    font-size: 2rem;
    color: #ff7043;
}

.nickname {
    margin-bottom: 0;
}

/* 정보 컨테이너 */
.exp-info-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 20px;
    color: #333;
    gap: 20px;
    width: 95%;
    padding: 10px;
    overflow: auto;
}

.exp-card {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s, box-shadow 0.3s;
    font-size: 1rem;
    color: #444;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.exp-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.highlight {
    color: #e74c3c;
    font-weight: bold;
    background: rgba(231, 76, 60, 0.1);
    padding: 3px 6px;
    border-radius: 8px;
    font-size: 1.5rem;
    transition: font-size 0.3s ease-in-out;
}

.info-section {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 1.2em;
    color: #444;
    text-align: center;
    display: inline-flex;
    align-items: center;
}

.info-icon {
    font-size: 18px;
    margin-left: 5px;
    color: #555;
}

.text-muted {
    color: #7f8c8d;
}

.positive {
    color: #27ae60;
    background: rgba(39, 174, 96, 0.1);
    padding: 3px 6px;
    border-radius: 8px;
}

.penalty {
    font-weight: bold;
}

.penalty-highlight {
    color: #c0392b;
    font-weight: bold;
    background: rgba(192, 57, 43, 0.1);
    padding: 3px 6px;
    border-radius: 8px;
    font-size: 1.5rem;
}

.time-remaining {
    color: #d35400;
    font-weight: bold;
    background: rgba(211, 84, 0, 0.1);
    padding: 3px 6px;
    border-radius: 8px;
    font-size: 1.1rem;
}

.exp-category {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow-x: auto;
}

.list-unstyled {
    list-style: none;
    padding-left: 0;
}

.list {
    font-size: 1.1em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.list.completed {
    color: #707974;
    position: relative;
}

.list.completed::before {
    content: '✔️';
}

.list.pending {
    font-weight: bold;
    color: #e64201;
    position: relative;
}

.list.pending::before {
    content: '⏳';
}

.highlight,
.time-remaining {
    animation: bounce 1s ease-in-out infinite alternate;
}

.penalty-highlight,
.list.pending {
    animation: shake 1s ease-in-out infinite alternate, fadeIn 1.5s ease-in-out;
}

@keyframes bounce {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-5px);
    }
}

@keyframes shake {
    0% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(5px, 0);
    }

    100% {
        transform: translate(0, 0);
    }
}


/* ===================================================== */

.right-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

.top-section {
    display: flex;
    flex: 1;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

/* ===================================================== */

/* 티어 정보 */
.tier-container {
    flex: 0.6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f7d794, #f3a683);
    border: 2px solid #d4af37;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    z-index: 10;
    transition: all 0.3s ease-in-out;
}

.tier {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 2.5vw;
    font-weight: bold;
    color: #4a2f13;
    border-radius: 8px;
    gap: 1.5vw;
}

.tier-pic-wrapper {
    position: relative;
    display: inline-block;
}

.tier-pic {
    width: 6.5vw;
}

.info-button {
    position: absolute;
    top: -5%;
    right: -20%;
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;
    padding: 4px;
}

.info-icon {
    width: 60%;
}

.exp-tier-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23vw;
}

.exp-tier-pic {
    width: 2.5vw;
}

.exp-bar-container {
    width: 17vw;
    height: 3.5vh;
    background: #e0e0e0;
    border-radius: 10px;
    margin: 0 auto;
    position: relative;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.exp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #f39c12, #e67e22);
    border-radius: 10px;
}

.exp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    font-weight: bold;
    color: #660000;
    font-size: 1.3vw;
    width: 100%;
    text-align: center;
}

/* 티어 정보 섹션 */
.rankings-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #d1e7ff, #b0c4de);
    border: 2px solid #4682b4;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 30vw;
    height: 33vh;
    z-index: 100;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -130%);
    transition: all 0.3s ease-in-out;
    opacity: 0;
}

.rankings-container.show {
    opacity: 1;
    visibility: visible;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out;
}

.overlay.show {
    opacity: 1;
    visibility: visible;
}

.tier-table {
    border-collapse: collapse;
}

.tier-cell {
    text-align: center;
    border: none;
    width: 7vw;
}

.tier-info {
    font-size: 1.7vw;
    font-weight: bold;
    text-align: center;
    padding: 1vh;
}

.tier-info-row {
    text-align: center;
}

.tier-title {
    font-weight: bold;
    margin: 0;
    font-size: 1vw;
}

.spacer-row td {
    height: 0.5vh;
}

.tier-iron,
.tier-bronze,
.tier-gold,
.tier-emerald,
.tier-diamond,
.tier-master,
.tier-legend,
.tier-goat {
    width: 2.7vw;
}

.tier-silver {
    width: 2.5vw;
}

.tier-platinum {
    width: 3.7vw;
}

/* ===================================================== */

.box3-and-buttons {
    display: flex;
    flex: 1;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

.box3 {
    flex: 2;
    z-index: 10;
    transition: all 0.3s ease-in-out;
}

/* ===================================================== */

/* 버튼 */
.button-container {
    display: flex;
    flex: 1.5;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
    gap: 30px;
    transition: all 0.3s ease-in-out;
}

.custom-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px 15px;
    background-color: #ff7043;
    border: 4px solid #d95c37;
    border-radius: 9999px;
    color: white;
    font-size: 1.7rem;
    font-weight: bold;
    cursor: pointer;
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

/* ===================================================== */

/* 캘린더 */
.calendar {
    flex: 2.5;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    padding: 20px;
    overflow: hidden;
    position: relative;
    z-index: 10;
    transition: all 0.3s ease-in-out;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.2rem;
    height: 30px;
    margin-bottom: 10px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(5, 1fr);
    gap: 10px;
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
}

.weekday {
    display: inline-block;
    width: 100%;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    color: #ff7043;
    padding: 2px 0;
    height: auto;
}

.day {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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
    box-shadow: none;
    padding: 50px;
    font-weight: 900;
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


/* 배경 아이콘 */
.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 0;
}

@keyframes float {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-30px);
    }
}
</style>