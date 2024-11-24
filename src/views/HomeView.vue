<template>
    <div class="mypage-container">

        <div class="box user-info">
            <div v-if="user" class="user-details">
                <h2 class="nickname">{{ user.nickname }}</h2>

                <div class="profile-pic-wrapper">
                    <img class="profile-pic" :src="user.profileImg" alt="프로필 사진" />
                    <button @click="openImageSelection" class="setting-button" aria-label="사진 선택">
                        <img src="@/assets/images/icon/setting-icon.png" alt="사진 선택 아이콘" class="setting-icon" />
                    </button>

                    <div v-if="isImageSelectionOpen" class="image-selection-modal">
                        <div class="modal-content">
                            <h3>프로필 이미지 선택</h3>
                            <div class="image-grid">
                                <img v-for="(image, index) in availableImages" :key="index" :src="image"
                                    @click="selectProfileImage(image)" class="profile-image-option"
                                    :alt="`프로필 이미지 ${index + 1}`" />
                            </div>
                            <button @click="closeImageSelection" class="close-button">닫기</button>
                        </div>
                    </div>
                </div>

                <p class="user-email">{{ user.email }}</p>

                <div @click="handleLogout" class="logout-item">로그아웃</div>
            </div>

            <div class="exp-info-container">
                <div class="exp-detail-info-container">
                    <div class="info-container">
                        <img src="@/assets/images/icon/info-icon.png" @click="toggleInfo" class="info-icon">
                        <div v-if="showInfo" class="info-popup">
                            <div class="info-title">[오늘의 경험치]</div>
                            <div style="margin-bottom: 20px;"> 오늘 얻은 경험치 / 최대 경험치 </div>
                            <div class="info-title">[플레이 경험치]</div>
                            <div style="margin-bottom: 20px;"> ✔️ : 성공, ⏳ : 진행 중</div>
                            <div class="info-title">[패널티 경험치]</div>
                            <div style="margin-bottom: 20px;"> 오늘 플레이 미진행 시, 최대 패널티 경험치</div>
                            <div class="info-title">[보너스 경험치]</div>
                            <div style="margin-bottom: 10px;">챌린지 연속 달성 시, 보너스 경험치 제공</div>
                            <div>7일 연속 달성: 10 exp</div>
                            <div>30일 연속 달성: 100 exp</div>
                        </div>
                    </div>
                </div>

                <div class="exp-card">
                    <div class="info-section">
                        승급 필요 경험치
                    </div>
                    <div class="highlight">{{ user.maxExp - user.exp }} exp</div>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        오늘 경험치
                    </h5>
                    <div class="highlight positive"> {{ totalAchievedExp + achievedChallengeCount * 5 }} exp</div> <span
                        class="text-muted">/ {{ todayChallenges.length * 5 + 70 }} exp</span>
                </div>

                <div class="exp-card">
                    <h5 class="info-section">
                        챌린지 경험치
                    </h5>
                    <ul class="list-unstyled">
                        <li v-if="processedChallenges.length === 0" class="no-challenge">
                            현재 생성된 챌린지가 없습니다.
                        </li>
                        <li v-for="(challenge, index) in processedChallenges" :key="index"
                            :class="['list', challenge.status === 'completed' ? 'completed' : 'pending']">
                            {{ challenge.title }}: 5 exp
                        </li>
                    </ul>
                </div>

                <div class="exp-card">
                    <div class="info-section">
                        게임 경험치
                    </div>
                    <ul class="list-unstyled">
                        <div v-for="(difficulties, exercise) in groupedByExercise" :key="exercise">
                            <div class="game-title">{{ exercise === "PUSHUP" ? "💪 Push Up" : "🏋️‍♂️ Squat" }}</div>
                            <ul class="list-unstyled">
                                <li v-for="(status, difficulty) in difficulties" :key="difficulty"
                                    :class="['list', status === 'completed' ? 'completed' : 'pending']">
                                    {{ difficulty }}: {{ expByDifficulty[difficulty] }} exp
                                </li>
                            </ul>
                        </div>
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
                    <div class="highlight time-remaining">10 exp (D-day 7)</div>
                    <div class="highlight time-remaining">100 exp (D-day 30)</div>
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
                    <div class="box box3 tier-container">
                        <h5 class="info-section">
                            자세연습하기
                        </h5>

                        <div class="webcam-button-container">
                            <button class="action-button" @click="goToWebcam('Push Up')">
                                <span>💪 Push Up</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button class="action-button" @click="goToWebcam('Squat')">
                                <span>🏋️‍♂️ Squat</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 24" stroke-width="5"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        <ul class="footer-notes">
                            <li>1. 올바른 위치에 웹캠을 고정시켜주세요.</li>
                            <li>2. 웹캠을 가리지 않도록 주의해주세요.</li>
                        </ul>
                    </div>

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
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAttendanceStore } from '@/stores/attendance';
import { useTodayChallengeStore } from '@/stores/todayChallenge';
import { useChallengeStore } from '@/stores/challenge';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';
import { characterImages, tierImages } from '@/assets/imageAssets';
import { useAchievedExp } from "@/composables/useAchievedExp";
import { useProcessedChallenges } from "@/composables/useProcessedChallenges";
import { useAuthStore } from "@/stores/auth";

const todayChallengeStore = useTodayChallengeStore();
const attendanceStore = useAttendanceStore();
const challengeStore = useChallengeStore();
const userStore = useUserStore();
const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showInfo = ref(false);
const { monthlyTodayChallenge } = storeToRefs(todayChallengeStore);
const { monthlyAttendance } = storeToRefs(attendanceStore);
const { monthlyGame } = storeToRefs(gameStore);
const { todayChallenges } = storeToRefs(todayChallengeStore);
const { challenges } = storeToRefs(challengeStore);
const { games } = storeToRefs(gameStore);
const { userId } = storeToRefs(userStore);
const { user } = storeToRefs(userStore);

const expByDifficulty = { "EASY": 5, "MEDIUM": 10, "HARD": 20 };

const { totalAchievedExp } = useAchievedExp(games, expByDifficulty, todayChallenges);
const { achievedChallengeCount } = useAchievedExp(games, expByDifficulty, todayChallenges);
const { groupedByExercise } = useAchievedExp(games, expByDifficulty, todayChallenges);
const { processedChallenges } = useProcessedChallenges(todayChallenges, challenges);

const toggleInfo = () => {
    showInfo.value = !showInfo.value;
};

const isImageSelectionOpen = ref(false);

const availableImages = ref([
    characterImages['bear'], characterImages['cat'], characterImages['chick'], characterImages['dog'], characterImages['koala'], characterImages['monkey'], characterImages['panda'], characterImages['tiger']
]);

const openImageSelection = () => { isImageSelectionOpen.value = true; };
const closeImageSelection = () => { isImageSelectionOpen.value = false; };

const selectProfileImage = (image) => {
    user.value.profileImg = image;
    userStore.updateUserInfo(userId.value, user.value);
    closeImageSelection();
};

const goToWebcam = (type) => {
    router.push({
        name: "WebcamView",
        params: {
            userId: userId.value,
            type: type
        }
    });
};

const showRankings = ref(false);

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

watch(route, async () => {
    const routeUserId = route.params.userId;
    if (routeUserId) {
        userId.value = routeUserId;
    }

    await userStore.fetchUserInfo(userId.value);
    addFloatingIcons();
    await generateCalendar();
    challengeStore.fetchChallenges(userId.value, "ONGOING");
    await todayChallengeStore.fetchTodayChallengeList(userId.value, new Date().toISOString().split("T")[0]);
    await gameStore.fetchGameList(userId.value, new Date().toISOString().split("T")[0]);
    increaseExp();
})

const startChallenge = () => {
    router.push({
        name: 'ChallengeSelectView',
        params: { userId: userId.value }
    });
};
const startGame = () => {
    router.push({
        name: 'GameSelectView',
        params: { userId: userId.value }
    })
};

const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());
const daysOfWeek = ref(['일', '월', '화', '수', '목', '금', '토']);

const daysInMonth = ref([]);

const generateCalendar = async () => {
    const daysInCurrentMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();

    await attendanceStore.fetchMonthlyAttendance(userId.value, parseInt(currentYear.value, 10), parseInt(currentMonth.value, 10));
    await gameStore.fetchMonthlyGame(userId.value, parseInt(currentYear.value, 10), parseInt(currentMonth.value, 10));
    await todayChallengeStore.fetchMonthlyTodayChallenge(userId.value, parseInt(currentYear.value, 10), parseInt(currentMonth.value, 10));

    daysInMonth.value = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        daysInMonth.value.push({ date: null });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const formattedDate = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isCheckedIn = monthlyAttendance.value.some((attendance) => attendance.attendDt === formattedDate && attendance.attended);
        const isChallengeSuccess = monthlyTodayChallenge.value.some((todayChallenge) => todayChallenge.date === formattedDate && todayChallenge.achieved);

        const isGameSuccess = monthlyGame.value.some((game) => game.date === formattedDate && game.achieved);

        daysInMonth.value.push({
            date: i,
            isCheckedIn: isCheckedIn,
            isChallengeSuccess: isChallengeSuccess,
            isGameSuccess: isGameSuccess,
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

const handleLogout = async () => {
    try {
        await authStore.logout(user.value.email);
        router.push({ name: "StartView" });
    } catch (err) {
        console.error("로그아웃 에러:", err);
    }
};

onMounted(async () => {
    const routeUserId = route.params.userId;
    if (routeUserId) {
        userId.value = routeUserId;
    }

    await userStore.fetchUserInfo(userId.value);
    addFloatingIcons();
    await generateCalendar();
    challengeStore.fetchChallenges(userId.value, "ONGOING");
    await todayChallengeStore.fetchTodayChallengeList(userId.value, new Date().toISOString().split("T")[0]);
    await gameStore.fetchGameList(userId.value, new Date().toISOString().split("T")[0]);
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

.box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    transition: all 0.3s ease-in-out;
}

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
    /* gap: 20px; */
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
    width: 70%;
    border-radius: 50%;
    border: 3px solid #ffab91;
    margin-bottom: 5px;
    margin-top: 5px;
}

.setting-button {
    position: absolute;
    top: 5px;
    right: 20px;
    background: none;
    border: none;
    box-shadow: none;
    padding: 4px;
}

.setting-icon {
    width: 80%;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
}

.setting-icon:hover {
    transform: scale(1.1) rotate(360deg);
    filter: brightness(1.2);
}

.modal-content {
    background-color: #d2d0d0;
    color: #282626;
    border-radius: 8px;
    padding: 20px;
    width: 300px;
    text-align: center;
}

.profile-image-option {
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: border-color 0.3s;
}

.profile-image-option:hover {
    border-color: #d8854e;
}

.close-button {
    background-color: #ff7043;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.current-profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 20px;
}


.user-details h2 {
    font-size: 2rem;
    color: #ff7043;
}

.nickname {
    margin-bottom: 10px;
}

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
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    max-height: 200px;
}

.exp-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.exp-detail-info-container {
    position: relative;
    grid-column: span 2;
    width: auto;
    height: 0px;
    border-radius: 15px;
}

.info-container {
    position: absolute;
    left: -10px;
    bottom: -20px;
    display: inline-block;
}

.info-popup {
    position: absolute;
    left: 10px;
    top: 20px;
    margin-top: 8px;
    padding: 12px;
    width: 350px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    font-size: 1.2rem;
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
    animation: shake 1s ease-in-out infinite alternate;
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

.right-section {
    display: flex;
    flex-direction: column;
    flex: 1.2;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

.top-section {
    display: flex;
    flex: 1;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

.tier-container {
    flex: 0.55;
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
    right: -30%;
    background: none;
    border: none;
    box-shadow: none;
    padding: 4px;
}

.heart-icon {
    cursor: pointer;
    transition: transform 0.2s ease, color 0.2s ease;
    font-size: 1.5rem;
    color: #ff0000;
}

.heart-icon:hover {
    transform: scale(1.3);
    color: #ff6666;
}

.info-icon {
    margin-left: 5px;
    color: #555;
    cursor: pointer;
    width: 60%;
    transition: transform 0.2s ease, filter 0.2s ease;
}

.info-icon:hover {
    transform: scale(1.3);
    filter: brightness(1.5);
}

.info-title {
    color: #e74c3c;
    font-weight: bold;
    margin-bottom: 5px;
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

.button-container {
    display: flex;
    flex: 1.5;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
    gap: 20px;
    transition: all 0.3s ease-in-out;
}

.custom-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0px 15px;
    background-color: #ff7043;
    border: 4px solid #d95c37;
    border-radius: 9999px;
    color: white;
    font-size: 2rem;
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

.calendar {
    flex: 3;
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

.game-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
}

.exp-card .list-unstyled {
    margin-top: 5px;
    margin-bottom: 0;
    padding-left: 0;
}

.logout-item {
    font-size: 1.1rem;
    color: #374151;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.1s ease-in-out, background-color 0.2s;
    cursor: pointer;
    margin-top: 10px;
}

.logout-item:hover {
    transform: scale(1.3);
    border-radius: 5px;
}

.no-challenge {
    color: gray;
    text-align: center;
    font-size: 1rem;
    margin: 10px 0;
}

.webcam-button-container {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.action-button {
    font-family: 'HakgyoansimDunggeunmisoTTF-B', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 15px;
    background-color: #ff7043;
    border: 4px solid #d95c37;
    border-radius: 9999px;
    color: white;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 41%;
    gap: 10px;
}

.action-button svg {
    width: 20%;
    height: 60%;
}

.action-button:hover {
    background: #f06292;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.footer-notes {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 1.5;
    margin-top: 20px;
}
</style>