<template>
    <div class="main-container">
        <video ref="video" autoplay playsinline class="webcam-video"></video>

        <div class="webcam-controls">
            <h2>{{ type }} 자세 연습 모드</h2>
            <div>{{ type }} 자세가 해당 이미지와 같도록</div>
            <div>카메라를 고정시켜주세요.</div>
        </div>

        <img v-if="type === 'Push Up'" src="@/assets/images/postures/pushup-posture.png" alt="Push Up 자세 이미지"
            class="pushup-posture" />
        <img v-if="type === 'Squat'" src="@/assets/images/postures/squat-posture.png" alt="Squat 자세 이미지"
            class="squat-posture" />

        <button @click="stopWebcamAndGoBack" class="close-button">닫기</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const type = route.params.type;
const userId = route.params.userId;

const video = ref(null);
let videoStream = null;

const startWebcam = async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
            video.value.srcObject = videoStream;
        }
    } catch (error) {
        console.error("웹캠 시작 실패:", error);
    }
};

const stopWebcamAndGoBack = () => {
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        videoStream = null;
        if (video.value) {
            video.value.srcObject = null;
        }
    }
    router.push({
        name: "HomeView",
        params: {
            userId: userId
        },
    });
};

onMounted(() => {
    startWebcam();
});

onBeforeUnmount(() => {
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
    }
});
</script>

<style scoped>
.main-container {
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: black;
}

.webcam-video {
    width: 1000px;
    height: 1000px;
    object-fit: cover;
    transform: scaleX(-1);
    z-index: 0;
    background-color: black;
    border-radius: 0;
    overflow: hidden;
}

.webcam-controls {
    position: fixed;
    top: 30px;
    left: 30px;
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    color: white;
    text-align: center;
    gap: 20px;
}

.close-button {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #e74c3c;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.close-button:hover {
    background: #c0392b;
}

.pushup-posture {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: auto;
    z-index: 1;
}

.squat-posture {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    width: 650px;
    height: auto;
    z-index: 1;
}
</style>