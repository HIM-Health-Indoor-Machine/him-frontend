<template>
    <div>
        <div class="main-container">
            <div class="header-container">
                <span class="header">챌린지 선택하기</span>
            </div>
            <div class="challenge-container">
                <div v-for="(challenge, index) in challenges" :key="index"
                    :class="['challenge-box', isEditing && editIndex === index ? 'edit-box' : '']">
                    <div v-if="!(isEditing && editIndex === index)" class="icon-container">
                        <span @click="toggleEdit(index)" class="icon-button">✏️</span>
                        <span @click="deleteChallenge(index)" class="icon-button delete-icon">🗑️</span>
                    </div>
                    <div v-if="isEditing && editIndex === index" class="edit-form open">
                        <span @click="isEditing = false" class="icon-button close-button">❌</span>
                        <form @submit.prevent="saveChallenge">
                            <div class="challenge-info">
                                <label style="font-size: 1.2rem;">🏆 챌린지 이름</label>
                                <input type="text" v-model="editChallenge.name" class="input-field"
                                    placeholder="예: '30일 푸쉬업 챌린지'">
                            </div>
                            <div class="challenge-info">
                                <label style="text-align: center; font-size: 1.2rem;">🔥 운동 타입</label>
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
                                <label style="font-size: 1.2rem;">⏰ 종료 날짜</label>
                                <input type="date" v-model="editChallenge.date" class="input-field">
                            </div>
                            <div class="challenge-info">
                                <label style="font-size: 1.2rem;">🎯 하루 목표 갯수</label>
                                <input type="number" v-model="editChallenge.goal" class="input-field"
                                    placeholder="예: 30">
                            </div>
                            <div class="button-container">
                                <button type="submit" class="action-button">저장</button>
                            </div>
                        </form>
                    </div>
                    <div v-else>
                        <div class="challenge-info-container">
                            <div class="banner">{{ challenge.name }}</div>
                            <div class="challenge-info">{{ challenge.icon }} {{ challenge.type }}</div>
                            <div class="challenge-info">⏰ {{ challenge.date }}</div>
                            <div class="challenge-info">🎯 목표: {{ challenge.goal }}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: challenge.progress + '%' }"></div>
                            </div>
                            <button class="start-button" @click="startChallenge(challenge.id)">챌린지 시작</button>
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
                            <input type="text" v-model="newChallenge.name" class="input-field"
                                placeholder="예: '30일 푸쉬업 챌린지'">
                        </div>
                        <div class="challenge-info">
                            <label style="text-align: center; font-size: 1.2rem;">🔥 운동 타입</label>
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
                            <label style="font-size: 1.2rem;">⏰ 종료 날짜</label>
                            <input type="date" v-model="newChallenge.date" class="input-field">
                        </div>
                        <div class="challenge-info">
                            <label style="font-size: 1.2rem;">🎯 하루 목표 갯수</label>
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
import { useRouter } from 'vue-router';

const router = useRouter();

const challenges = ref([
    { id: 1, name: "파워푸쉬업7일", type: "Push Up", icon: "💪", date: "2023-12-31", goal: 30, progress: 60 },
    { id: 2, name: "꾸준스쿼트30일", type: "Squat", icon: "🏋️‍♂️", date: "2024-01-15", goal: 20, progress: 40 }
]);
const isCreating = ref(false);
const isEditing = ref(false);
const editIndex = ref(null);
const newChallenge = reactive({ name: "", type: "Push Up", date: "", goal: null });
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];
const floatingIcons = ref([]);
const editChallenge = reactive({ name: "", type: "", date: "", goal: null });

const deleteChallenge = (index) => {
    challenges.value.splice(index, 1);
};

const startChallenge = (id) => {
    router.push({ 
        name: 'ChallengePlayView', 
        params: { id: id } 
    });
};

const toggleEdit = (index) => {
    if (editIndex.value === index && isEditing.value) {
        isEditing.value = false;
    } else {
        isEditing.value = true;
        editIndex.value = index;
        const challenge = challenges.value[index];
        editChallenge.name = challenge.name;
        editChallenge.type = challenge.type;
        editChallenge.date = challenge.date;
        editChallenge.goal = challenge.goal;
    }
};

const toggleForm = () => {
    isCreating.value = !isCreating.value;
};

const resetForm = () => {
    newChallenge.name = "";
    newChallenge.type = "Push Up";
    newChallenge.date = "";
    newChallenge.goal = null;
    isCreating.value = false;
};

const saveChallenge = () => {
    if (newChallenge.date && newChallenge.goal) {
        challenges.value.push({
            name: newChallenge.name,
            type: newChallenge.type,
            icon: newChallenge.type === "Push Up" ? "💪" : "🏋️‍♂️",
            date: newChallenge.date,
            goal: newChallenge.goal,
            progress: 0
        });
        resetForm();
    } else if (editChallenge.date && editChallenge.goal) {
        challenges.value[editIndex.value] = {
            name: editChallenge.name,
            type: editChallenge.type,
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
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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
    transition: transform 0.3s, box-shadow 0.3s;
    z-index: -1;
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
    font-size: 3rem;
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
    width: 60%;
    background-color: #ff7043;
    animation: fillProgress 1s forwards;
}

.start-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 12px; /* 패딩 줄임 */
    background-color: #ff7043;
    border: 3px solid #d95c37; /* 테두리 두께 줄임 */
    border-radius: 9999px;
    color: white;
    font-size: 1rem; /* 폰트 크기 줄임 */
    font-weight: bold;
    cursor: pointer;
}

.start-button svg {
    width: 20%; /* 너비 줄임 */
    height: 40%; /* 높이 줄임 */
}

.start-button span {
    margin-right: 6px; /* 오른쪽 여백 줄임 */
}

.start-button:hover {
    background: #f06292;
    transform: scale(1.05);
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