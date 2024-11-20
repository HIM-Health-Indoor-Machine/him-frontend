<template>
    <div>
        <div class="main-container">
            <div class="header-container">
                <span class="header">챌린지를 선택해주세요!</span>
                <div class="subtitle">또는 챌린지를 수정, 삭제 및 추가할 수 있습니다.</div>
            </div>

            <div v-if="isDeleteModalOpen" class="modal-overlay">
                <div class="modal">
                    <p>정말 삭제하시겠습니까?</p>
                    <div class="modal-buttons">
                        <button @click="confirmDelete" class="confirm-button">네</button>
                        <button @click="closeDeleteModal" class="cancel-button">아니요</button>
                    </div>
                </div>
            </div>

            <div class="challenge-container">
                <div v-for="(challenge, index) in challenges" :key="index"
                    :class="['challenge-box', isEditing && editIndex === index ? 'edit-box' : '', selectedChallenge === challenge ? 'selected' : '']"
                    @click="selectChallenge(index)">

                    <div v-if="!(isEditing && editIndex === index)" class="icon-container">
                        <span @click="toggleEdit(index)" class="icon-button">✏️</span>
                        <span @click="deleteChallenge(index)" class="icon-button delete-icon">🗑️</span>
                    </div>

                    <div v-if="isEditing && editIndex === index" class="edit-form open">
                        <span @click="isEditing = false" class="icon-button close-button">❌</span>
                        <form @submit.prevent="saveChallenge">
                            <div class="challenge-info">
                                <label style="font-size: 1.2rem;">🏆 챌린지 이름</label>
                                <div placeholder="예: '30일 푸쉬업 챌린지'" disabled>{{ editChallenge.title }}</div>
                            </div>
                            <div class="challenge-info">
                                <label style="text-align: center; font-size: 1.2rem;">🔥 운동 타입</label>
                                <div style="display: flex; justify-content: space-around; align-items: center;">
                                    <label>
                                        <input type="radio" v-model="editChallenge.type" value="PUSHUP">
                                        💪 Push Up
                                    </label>
                                    <label>
                                        <input type="radio" v-model="editChallenge.type" value="SQUAT">
                                        🏋️‍♂️ Squat
                                    </label>
                                </div>
                            </div>
                            <div class="challenge-info">
                                <label style="font-size: 1.2rem;">⏰ 종료 날짜</label>
                                <input type="date" v-model="editChallenge.endDt" class="input-field">
                            </div>
                            <div class="challenge-info">
                                <label style="font-size: 1.2rem;">🎯 하루 목표 개수</label>
                                <input type="number" v-model="editChallenge.goalCnt" class="input-field"
                                    placeholder="예: 30">
                            </div>
                            <div class="button-container">
                                <button type="submit" class="action-button">저장</button>
                            </div>
                        </form>
                    </div>

                    <div v-else>
                        <div class="challenge-info-container">
                            <div class="banner">{{ challenge.title }}</div>
                            <div class="challenge-info">{{ challenge.icon }} {{ challenge.type === 'PUSHUP' ? 'Push Up'
                                : 'Squat' }}</div>
                            <div class="challenge-info">⏰ {{ challenge.endDt }}</div>
                            <div class="challenge-info">🎯 목표: {{ challenge.goalCnt }}</div>
                            <div class="progress-bar">
                                <div class="progress-fill"
                                    :style="{ width: calculateProgress(challenge.achievedCnt, challenge.startDt, challenge.endDt) + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!isCreating" @click="toggleForm" class="challenge-box new-challenge-box">
                    <div>+</div>
                    <div></div>
                </div>

                <div v-if="isCreating" class="challenge-box new-challenge-form open">
                    <form @submit.prevent="saveChallenge">
                        <span @click="isCreating = false" class="icon-button close-button2">❌</span>

                        <div class="challenge-info">
                            <label style="font-size: 1.2rem;">🏆 챌린지 이름</label>
                            <input type="text" v-model="newChallenge.title" class="input-field"
                                placeholder="예: '30일 푸쉬업 챌린지'">
                        </div>

                        <div class="challenge-info">
                            <label style="text-align: center; font-size: 1.2rem;">🔥 운동 타입</label>
                            <div style="display: flex; justify-content: space-around; align-items: center;">
                                <label>
                                    <input type="radio" v-model="newChallenge.type" value="PUSHUP">
                                    💪 Push Up
                                </label>
                                <label>
                                    <input type="radio" v-model="newChallenge.type" value="SQUAT">
                                    🏋️‍♂️ Squat
                                </label>
                            </div>
                        </div>

                        <div class="challenge-info">
                            <label style="font-size: 1.2rem;">⏰ 종료 날짜</label>
                            <input type="date" v-model="newChallenge.endDt" class="input-field">
                        </div>

                        <div class="challenge-info">
                            <label style="font-size: 1.2rem;">🎯 하루 목표 개수</label>
                            <input type="number" v-model="newChallenge.goalCnt" class="input-field" placeholder="예: 30">
                        </div>

                        <div class="button-container">
                            <button type="submit" class="action-button">저장</button>
                        </div>
                    </form>
                </div>
            </div>

            <button @click="startChallenge(selectedChallenge.id)" class="custom-button" :disabled="!selectedChallenge"
                :style="{ animation: selectedChallenge ? '' : 'jittery 4s infinite' }">
                <span>시작하기</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" width="130"
                    height="130" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" width="80" height="80" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div class="box box3">
                <div class="exp-info-container">
                    <div class="exp-detail-info-container">
                        <div class="info-container">
                            <img src="@/assets/images/icon/info-icon.png" @click="toggleInfo" class="info-icon">
                            <div v-if="showInfo" class="info-popup">
                                <p class="info-title">[오늘의 챌린지]</p>
                                <p>오늘 성취한 챌린지(✔️)와 <br> 도전하지 않은 챌린지(⏳) <br> 목록입니다.</p>
                            </div>
                        </div>
                    </div>

                    <div class="exp-card">
                        <h5 class="info-section">
                            챌린지 목록
                        </h5>
                        <ul class="list-unstyled">
                            <li v-for="(challenge, index) in challenges" :key="index"
                                :class="['list', isProcessed(challenge.id) ? 'completed' : 'pending']">
                                {{ challenge.title }}: 5 exp
                            </li>
                        </ul>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useChallengeStore } from '@/stores/challenge';
import { useTodayChallengeStore } from '@/stores/todayChallenge';
import { useProcessedChallenges } from "@/composables/useProcessedChallenges";

const todayChallengeStore = useTodayChallengeStore();
const challengeStore = useChallengeStore();
const router = useRouter();
const route = useRoute();

const userId = route.params.userId;

const { todayChallenges } = storeToRefs(todayChallengeStore);
const { challenges } = storeToRefs(challengeStore);
const isCreating = ref(false);
const isEditing = ref(false);
const editIndex = ref(null);
const newChallenge = reactive({ title: "", status: "ONGOING", type: "PUSHUP", startDt: new Date().toISOString().split("T")[0], endDt: "", goalCnt: null, userId: userId });
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];
const floatingIcons = ref([]);
const editChallenge = reactive({ title: "", status: "ONGOING", type: "", startDt: "", endDt: "", goalCnt: null, userId: userId });
const selectedChallenge = ref(null);
const isDeleteModalOpen = ref(false);
const deleteIndex = ref(null);
const showInfo = ref(false);

const { processedChallenges } = useProcessedChallenges(todayChallenges, challenges);

const isProcessed = (challengeId) => {
    return processedChallenges.value.some(
        (processed) => processed.challengeId === challengeId
    );
};

const calculateProgress = (achievedCnt, startDt, endDt) => {
    const totalDays = Math.ceil((new Date(endDt) - new Date(startDt)) / (1000 * 60 * 60 * 24)) + 1;
    return ((achievedCnt / totalDays) * 100).toFixed(2);
}

const selectChallenge = (index) => {
    selectedChallenge.value = challenges.value[index];
};

const deleteChallenge = (index) => {
    deleteIndex.value = index;
    isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
    if (deleteIndex.value !== null) {
        try {
            challengeStore.deleteChallenge(challenges.value[deleteIndex.value].id);

            challenges.value.splice(deleteIndex.value, 1);
            deleteIndex.value = null;
        } catch (error) {
            console.error(error);
        } finally {
            isDeleteModalOpen.value = false;
        }
    }
    isDeleteModalOpen.value = false;
}

function closeDeleteModal() {
    isDeleteModalOpen.value = false;
}

const startChallenge = (id) => {
    if (selectedChallenge.value) {
        router.push({
            name: 'ChallengePlayView',
            params: {
                challengeId: id,
                userId: userId
            }
        });
    } else {
        alert("챌린지를 선택해주세요.");
    }
}

const toggleEdit = (index) => {
    const challenge = challenges.value[index];
    if (editIndex.value === index && isEditing.value) {
        isEditing.value = false;
    } else {
        isEditing.value = true;
        editIndex.value = index;
        editChallenge.id = challenge.id;
        editChallenge.title = challenge.title;
        editChallenge.type = challenge.type;
        editChallenge.startDt = challenge.startDt;
        editChallenge.endDt = challenge.endDt;
        editChallenge.goalCnt = challenge.goalCnt;
        editChallenge.userId = challenge.userId;
    }
};

const toggleForm = () => {
    isCreating.value = !isCreating.value;
};

const resetForm = () => {
    newChallenge.title = "";
    newChallenge.type = "";
    newChallenge.endDt = "";
    newChallenge.goalCnt = null;
    isCreating.value = false;
};

const saveChallenge = () => {
    if (newChallenge.endDt && newChallenge.goalCnt) {
        challenges.value.push({
            title: newChallenge.title,
            type: newChallenge.type,
            icon: newChallenge.type === "PUSHUP" ? "💪" : "🏋️‍♂️",
            endDt: newChallenge.endDt,
            goalCnt: newChallenge.goalCnt,
            progress: 0
        });

        challengeStore.addChallenge(newChallenge);
        resetForm();
    } else if (editChallenge.endDt && editChallenge.goalCnt) {
        challenges.value[editIndex.value] = {
            id: editChallenge.id,
            title: editChallenge.title,
            type: editChallenge.type,
            icon: editChallenge.type === "PUSHUP" ? "💪" : "🏋️‍♂️",
            startDt: editChallenge.startDt,
            endDt: editChallenge.endDt,
            goalCnt: editChallenge.goalCnt,
            userId: editChallenge.userId,
            progress: challenges.value[editIndex.value].progress
        };
        challengeStore.updateChallenge(editChallenge.id, editChallenge);
        isEditing.value = false;
    } else {
        alert("날짜와 목표를 입력해주세요.");
    }
};

const toggleInfo = () => {
    showInfo.value = !showInfo.value;
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

onMounted(async () => {
    try {
        await challengeStore.fetchChallenges(1, "ONGOING");
    } catch (error) {
        console.error(error);
    }
    await todayChallengeStore.fetchTodayChallengeList(userId, new Date().toISOString().split("T")[0]);
    addFloatingIcons();
});
</script>

<style scoped>
.box {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    height: 40%;
}

.box1 {
    flex: 1;
}

.box2 {
    flex: 2;
}

.box3 {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}

.exp-info-container {
    grid-template-columns: repeat(2, 1fr);
    border-radius: 20px;
    color: #333;
    gap: 20px;
    width: 15%;
    height: 300px;
    padding: 10px;
    overflow: auto;
    z-index: 10;
    position: fixed;
    top: 110px;
    right: 10px;
}

.exp-detail-info-container {
    position: relative;
    grid-column: span 2;
    width: auto;
    height: 0px;
    border-radius: 15px;
    gap: 0px;
}

.info-container {
    position: relative;
    display: inline-block;
    z-index: 100;
}

.info-icon {
    cursor: pointer;
    font-size: 20%;
    height: 20px;
    width: 20px;
}

.info-title {
    color: #e74c3c;
    font-weight: bold;
}

.info-popup {
    position: absolute;
    top: 70%;
    left: 10%;
    margin-top: 8px;
    padding: 12px;
    width: 13vw;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    font-size: 0.9rem;
    text-align: center;
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
    margin-right: -5px;
    overflow-y: auto;
    overflow-x: hidden;
}

.exp-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.info-section {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 1.5em;
    color: #444;
    text-align: center;
    display: inline-flex;
    align-items: center;
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

.list.pending {
    animation: shake 1s ease-in-out infinite alternate;
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

.main-container {
    position: relative;
    top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease-in-out;
}

.challenge-container {
    display: flex;
    gap: 20px;
    padding: 2rem;
    position: relative;
    z-index: 1;
    max-width: 80vw;
    overflow-x: auto;
    white-space: nowrap;
    scroll-behavior: smooth;
    transition: all 0.3s ease-in-out;
}

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

.challenge-box {
    width: 18vw;
    height: 45vh;
    flex-shrink: 0;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    ;
    z-index: -1;
    cursor: pointer;
    border: 2px solid transparent;
}

.challenge-info-container {
    position: absolute;
    top: 12%;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
}

.challenge-info {
    font-size: 25px;
    line-height: 3;
    margin: 8px 0;
}

.challenge-box.selected {
    border-width: 5px;
    border-color: #ff7043;
    animation: highlight2 0.3s forwards;
}

@keyframes highlight2 {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(255, 112, 67, 0);
    }

    100% {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(255, 112, 67, 0.5);
    }
}

.progress-bar {
    height: 12px;
    width: 100%;
    background-color: #cfcfcf;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 8px;
}

.challenge-box:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    color: #ff7043;
    background: #fff7e0;
    border-radius: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    padding: 20px 40px;
    gap: 10px
}

.header {
    font-size: 2.5rem;
    font-weight: bold;
}

.subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #718096;
}

.banner {
    position: relative;
    display: block;
    margin: 20px auto;
    width: 80%;
    max-width: 300px;
    height: 50px;
    border: 1px solid #8a1;

    font: bold 25px/50px 'HakgyoansimDunggeunmisoTTF-B';
    text-align: center;
    color: #ffffff;
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15) inset,
        0 4px 8px rgba(0, 0, 0, 0.15);
    margin: 0px;
}

.banner::before,
.banner::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: -15%;
    top: 30%;
    display: block;
    width: 10%;
    border: 25px solid;
    border-color: #4caf50;
    border-right: 15px solid #2e7d32;
    border-bottom-color: #388e3c;
    border-left-color: transparent;
    transform: rotate(-5deg);
}

.banner::after {
    left: auto;
    right: -15%;
    border-left: 15px solid #2e7d32;
    border-right: 25px solid transparent;
    transform: rotate(5deg);
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
    width: 0%;
    background-color: #ff7043;
}


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

.new-challenge-box div:first-child {
    font-size: 150px;
    font-weight: 700;
    color: #ff7043;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, color 0.3s;
}

.new-challenge-box:hover div:first-child {
    transform: scale(1.2);
    color: #f06292;
}

.new-challenge-box div:last-child {
    margin-top: 8px;
    font-size: 18px;
    color: #4b5563;
    font-weight: 500;
}

.new-challenge-form {
    background-color: rgba(255, 245, 238, 0.9);
    border: 2px dashed #ff7043;
    padding: 1rem;
    font-size: 14px;
    line-height: 1.4;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.new-challenge-form .challenge-info {
    font-size: 14px;
    line-height: 2;
    margin: 8px 0;
}

.challenge-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 0;
}

.input-field {
    width: 90%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: -20px;
}

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
    transition: background-color 0.3s;
    margin: 10px auto;
}

.action-button:hover {
    background-color: #f06292;
}

.icon-container {
    position: absolute;
    top: 8px;
    right: 10px;
    display: flex;
    gap: 8px;
}

.icon-button {
    cursor: pointer;
    font-size: 18px;
    transition: color 0.3s;
}

.icon-button:hover {
    transform: scale(1.2);
}

.edit-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    background-color: rgba(255, 245, 238, 0.9);
    border: 2px dashed #ff7043;
    padding: 1rem;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.edit-form {
    background-color: transparent;
    border: none;
    justify-content: center;
    padding: 0;
    font-size: 14px;
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.edit-form .challenge-info {
    font-size: 14px;
    line-height: 2;
    margin: 8px 0;
}

.edit-box:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.delete-icon {
    color: #f44336;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    border-radius: 10px;
    text-align: center;
    font-size: 2rem;
    width: 500px;
    height: 300px;
    line-height: 0;
}

.modal-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.confirm-button,
.cancel-button {
    padding: 10px 30px;
    font-size: 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.confirm-button {
    background-color: #ff4d4d;
    color: white;
}

.cancel-button {
    background-color: #cccccc;
}

.close-button {
    position: absolute;
    top: -1%;
    right: -1%;
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
}

.close-button2 {
    position: absolute;
    top: 2%;
    right: 2%;
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
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
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    box-sizing: border-box;
    animation: jittery 4s infinite;
    z-index: 10;
}

.custom-button svg {
    width: 30%;
    height: 20%;
}

.custom-button span {
    margin-right: 8px;
}

.custom-button:hover {
    background: #f06292;
    transform: scale(1.05);
}

.custom-button:disabled {
    background-color: #cccccc;
    border: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
}

@keyframes jittery {

    5%,
    50% {
        transform: scale(1);
    }

    10% {
        transform: scale(0.9);
    }

    15% {
        transform: scale(1.15);
    }

    20% {
        transform: scale(1.15) rotate(-5deg);
    }

    25% {
        transform: scale(1.15) rotate(5deg);
    }

    30% {
        transform: scale(1.15) rotate(-3deg);
    }

    35% {
        transform: scale(1.15) rotate(2deg);
    }

    40% {
        transform: scale(1.15) rotate(0);
    }
}

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

@keyframes openCard {
    from {
        transform: rotateY(-90deg);
        opacity: 0;
    }

    to {
        transform: rotateY(0);
        opacity: 1;
    }
}

.open {
    animation: openCard 0.5s ease-out forwards;
    transform-origin: left;
    opacity: 0;
}
</style>