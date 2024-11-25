<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
            <h3 class="modal-title">{{ title }}</h3>
            <p class="modal-message">{{ message }}</p>
            <button @click="closeModal" class="modal-button">닫기</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: "알림",
    },
    message: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.modal-message {
    font-size: 1rem;
    margin-bottom: 20px;
}

.modal-button {
    padding: 10px 20px;
    background-color: #f33a3a;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.modal-button:hover {
    background-color: #45a049;
}
</style>
