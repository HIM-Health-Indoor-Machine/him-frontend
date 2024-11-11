<template>
    <div>
        <div class="main-container">
            <div class="header-container">
                <span class="header">Challenge Selection</span>
            </div>
            <div class="challenge-container">
                <div v-for="(challenge, index) in challenges" :key="index" :class="['challenge-box', isEditing && editIndex === index ? 'edit-box' : '']">
                    <div class="icon-container">
                        <span @click="toggleEdit(index)" class="icon-button">✏️</span>
                        <span @click="deleteChallenge(index)" class="icon-button delete-icon">🗑️</span>
                    </div>
                    <div v-if="isEditing && editIndex === index" class="edit-form open">
                        <form @submit.prevent="saveChallenge">
                            <div class="challenge-info">
                                <label style="text-align: center;">🔥 운동 타입</label>
                                <div style="display: flex; justify-content: space-around; align-items: center;">
                                    <label>
                                        <input type="radio" v-model="editChallenge.type" value="Push Up">
                                        💪 Push Up
                                    </label>
                                    <label>
                                        <input type="radio" v-model="editChallenge.type" value="Squat">
                                        🏋️‍♂️ Squat
                                    </label>
                                </div>
                            </div>
                            <div class="challenge-info">
                                <label>⏰ 종료 날짜</label>
                                <input type="date" v-model="editChallenge.date" class="input-field">
                            </div>
                            <div class="challenge-info">
                                <label>🎯 하루 목표 갯수</label>
                                <input type="number" v-model="editChallenge.goal" class="input-field" placeholder="예: 30">
                            </div>
                            <div class="button-container">
                                <button type="submit" class="action-button">저장</button>
                            </div>
                        </form>
                    </div>
                    <div v-else>
                        <div class="challenge-info">{{ challenge.icon }} {{ challenge.name }}</div>
                        <div class="challenge-info">⏰ {{ challenge.date }}</div>
                        <div class="challenge-info">🎯 목표: {{ challenge.goal }}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: challenge.progress + '%' }"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!isCreating" @click="toggleForm" class="challenge-box new-challenge-box">
                    <div>+</div>
                    <div></div>
                </div>
                <div v-if="isCreating" class="challenge-box new-challenge-form open">
                    <form @submit.prevent="saveChallenge">
                        <div class="challenge-info">
                            <label style="text-align: center;">🔥 운동 타입</label>
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
const isEditing = ref(false);
const editIndex = ref(null);
const newChallenge = reactive({ type: "Push Up", date: "", goal: null });
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];
const floatingIcons = ref([]);
const editChallenge = reactive({ type: "", date: "", goal: null }); // 수정용 객체

const deleteChallenge = (index) => {
    challenges.value.splice(index, 1);
};

const toggleEdit = (index) => {
    if (editIndex.value === index && isEditing.value) {
        isEditing.value = false;
    } else {
        isEditing.value = true;
        editIndex.value = index;
        const challenge = challenges.value[index];
        editChallenge.type = challenge.name;
        editChallenge.date = challenge.date;
        editChallenge.goal = challenge.goal;
    }
};

const toggleForm = () => {
    isCreating.value = !isCreating.value;
};

const resetForm = () => {
    newChallenge.type = "Push Up";
    newChallenge.date = "";
    newChallenge.goal = null;
    isCreating.value = false;
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
    } else if (editChallenge.date && editChallenge.goal) {
        challenges.value[editIndex.value] = {
            name: editChallenge.type,
            icon: editChallenge.type === "Push Up" ? "💪" : "🏋️‍♂️",
            date: editChallenge.date,
            goal: editChallenge.goal,
            progress: challenges.value[editIndex.value].progress
        };
        isEditing.value = false;
    } else {
        alert("날짜와 목표를 입력해주세요.");
    }
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

onMounted(addFloatingIcons);
</script>

<style scoped>
/* 전체 화면 설정 - 전역 CSS와 충돌했을 때 대비용으로 남겨두었습니다. */
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

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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
    width: 220px;
    height: 280px;
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;
}

.challenge-info {
    font-size: 25px;
    line-height: 3;
    margin: 8px 0;
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
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    z-index: 10;
}

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
    background-color: #ff7043;
    animation: fillProgress 1s forwards;
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
    font-size: 100px;
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
    align-items: flex-start;
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
    transition: transform 0.2s;
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