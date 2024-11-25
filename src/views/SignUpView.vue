<template>
    <div>
        <div class="signup-container">
            <div class="login-header">
                <div class="title">
                    <div class="logo-container">
                        <img src="/images/logo/logo.png" alt="로고 아이콘" class="logo-icon" />
                        HIM
                    </div>
                </div>
                <div class="subtitle">Health Indoor Machine</div>
            </div>
            <h2 class="welcome-message">환영합니다!</h2>
            <p class="intro-text">HIM으로 힘을 길러보세요!</p>

            <form @submit.prevent="validateAndSubmit">
                <div class="form-group hint-group">
                    <label class="form-label">사용할 닉네임을 입력해주세요.</label>
                    <small class="hint-text">닉네임은 한글/영문 포함 최대 10글자까지 가능합니다.</small>
                    <input type="text" v-model="nickname" class="input-field" @input="limitNicknameLength"
                        placeholder="예) 나는운동강아지" required>
                </div>
                <div class="form-group hint-group">
                    <label class="form-label">이메일을 입력해주세요.</label>
                    <small v-if="verificationMessage" :class="verificationSuccess ? 'hint-success' : 'hint-error'">
                        {{ verificationMessage }}
                    </small>
                    <div class="email-input-wrapper">
                        <input type="email" v-model="email" class="input-field" placeholder="예) him@google.com"
                            @input="validateEmail" required>
                        <button type="button" class="verify-button" @click="handleSendVerificationCode"
                            :disabled="!isEmailValid">
                            인증코드 요청
                        </button>
                    </div>
                </div>
                <div class="form-group hint-group">
                    <label class="form-label">인증 코드를 입력해주세요.</label>
                    <small v-if="verificationCheckMessage"
                        :class="verificationCheckSuccess ? 'hint-success' : 'hint-error'">
                        {{ verificationCheckMessage }}
                    </small>
                    <div class="email-input-wrapper">
                        <input type="text" v-model="authCode" class="input-field" placeholder="이메일 코드" required>
                        <button type="button" class="verify-button" @click="handleVerifyCode" :disabled="!authCode">
                            인증하기
                        </button>
                    </div>
                </div>
                <div class="form-group hint-group">
                    <label class="form-label">비밀번호를 입력해주세요.</label>
                    <small class="alarm-text" v-if="passwordMessage"> 비밀번호는 8자 이상의 숫자, 특수 문자(!@#$%^&*), 영문자를
                        포함해주세요.</small>
                    <input type="password" v-model="password" class="input-field" placeholder="비밀번호"
                        @input="validatePassword" required>
                </div>
                <div class="form-group hint-group">
                    <label class="form-label">비밀번호를 다시 입력해주세요.</label>
                    <span class="alarm-text" v-if="passwordMatchMessage">{{ passwordMatchMessage }}</span>
                    <input type="password" v-model="passwordRetype" class="input-field" placeholder="비밀번호 재입력"
                        @input="checkPasswordMatch" required>
                </div>

                <button type="submit" class="signup-button" :disabled="!isFormValid">회원가입하기</button>
            </form>
        </div>

        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <h3 style="font-size: 2rem;">회원가입에 성공했습니다!</h3>
                <div style="color: brown; margin-bottom: 10px;">꾸준함 속에 달콤한 열매가 있습니다.</div>
                <div style="color: brown; margin-bottom: 10px;">HIM은 여러분의 꾸준함을 보장합니다.</div>
                <div style="color: brown;">자, 이제 달콤한 열매를 얻을 준비가 되셨나요?</div>
                <button @click="goToLogin" class="popup-button">로그인하기</button>
            </div>
        </div>

        <Modal :visible="showModal" :title="modalTitle" :message="modalMessage" @close="showModal = false" />

        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon"
            :style="{ top: icon.top, left: icon.left, animationDuration: icon.speed }">
            {{ icon.icon }}
        </div>
    </div>
</template>

<script setup>
import Modal from "@/components/Modal.vue";
import { useAuthStore } from '@/stores/auth.js';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const nickname = ref('');
const email = ref('');
const authCode = ref('');
const password = ref('');
const passwordRetype = ref('');

const passwordMessage = ref('');
const passwordMatchMessage = ref('');

const isFormValid = ref(false);
const isEmailValid = ref(false);
const showPopup = ref(false);

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const currentLength = ref(0);

const verificationMessage = ref("");
const verificationSuccess = ref(false);

const verificationCheckMessage = ref("");
const verificationCheckSuccess = ref(false);

const validatePassword = () => {
    const value = password.value;
    const errors = [];

    if (!/[a-zA-Z]/.test(value)) errors.push('영문자');
    if (!/[0-9]/.test(value)) errors.push('숫자');
    if (!/[!@#$%^&*]/.test(value)) errors.push('특수 문자(!@#$%^&*)');
    if (value.length < 8) errors.push('8자 이상');

    if (errors.length > 0) {
        passwordMessage.value = `비밀번호는 ${errors.join(', ')}가 포함되어야 합니다.`;
    } else {
        passwordMessage.value = '';
    }

    updateFormValidity();
};

const checkPasswordMatch = () => {
    if (password.value !== passwordRetype.value) {
        passwordMatchMessage.value = '비밀번호가 일치하지 않습니다.';
    } else {
        passwordMatchMessage.value = '';
    }

    updateFormValidity();
};

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isEmailValid.value = emailRegex.test(email.value.trim());
};

const updateFormValidity = () => {
    isFormValid.value =
        nickname.value.trim() !== '' &&
        email.value.trim() !== '' &&
        passwordMessage.value === '' &&
        passwordMatchMessage.value === '' &&
        passwordRetype.value.trim() !== '' &&
        verificationCheckSuccess.value;
};

const validateAndSubmit = async () => {
    const userData = {
        nickname: nickname.value,
        email: email.value,
        password: password.value,
    };

    await authStore.signUp(userData);

    if (authStore.signupStatus.success) {
        showPopup.value = true;
    } else {
        modalTitle.value =
            authStore.signupStatus.errorType === "nickname"
                ? "닉네임 중복"
                : authStore.signupStatus.errorType === "email"
                    ? "이메일 중복"
                    : "오류";
        modalMessage.value = authStore.signupStatus.message;
        showModal.value = true;
    }
};

const goToLogin = () => {
    showPopup.value = false;
    router.push('/login-view');
};

const handleSendVerificationCode = async () => {
    await authStore.sendVerificationCode(email.value);
    const status = authStore.verificationStatus;
    verificationSuccess.value = status.success;
    verificationMessage.value = status.message;
};

const handleVerifyCode = async () => {
    await authStore.verifyCode(email.value, authCode.value);
    const status = authStore.verificationStatus;
    verificationCheckSuccess.value = status.success;
    verificationCheckMessage.value = status.message;
    updateFormValidity();
};

const limitNicknameLength = () => {
    const nicknameValue = nickname.value;

    const totalLength = Array.from(nicknameValue).reduce((acc, char) => {
        const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(char);
        return acc + (isKorean ? 1 : 1);
    }, 0);

    if (totalLength > 10) {
        nickname.value = Array.from(nicknameValue)
            .slice(0, 10)
            .join('');
    }

    currentLength.value = Math.min(totalLength, 10);
};

const floatingIcons = ref([]);
const icons = ["💪", "❤️", "🏋️‍♂️", "🔥", "💚", "⏱️", "👟", "🏆", "💦", "🤸‍♀️", "🚴", "🏃", "🥇", "🏅", "🧘", "🩺", "🥗", "🍎", "🥤", "🚶"];

const createFloatingIcons = () => {
    for (let i = 0; i < 60; i++) {
        floatingIcons.value.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            speed: (5 + Math.random() * 5) + 's'
        });
    }
};

onMounted(() => {
    createFloatingIcons();
});
</script>

<style scoped>
.signup-container {
    max-width: 28rem;
    width: 100vw;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
    transition: all 0.3s ease-in-out;
}

.login-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.title {
    font-size: 5rem;
    font-weight: 700;
    color: #2cca95;
    -webkit-text-stroke: 2px #000;
}

.subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #718096;
}

.welcome-message {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #ff7043;
}

.intro-text {
    font-size: 1.3rem;
    text-align: center;
    color: #718096;
    margin-bottom: 1.5rem;
}

.alarm-text {
    display: block;
    font-size: 0.8rem;
    color: #e92a2a;
}

.hint-text {
    display: block;
    font-size: 0.8rem;
    color: #718096;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2%;
}

.logo-icon {
    width: 30%;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    color: #4a5568;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.input-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cfd8dc;
    border-radius: 0.5rem;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.input-field:focus {
    border-color: #ff7043;
    box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.2);
}

.form-checkbox {
    height: 1rem;
    width: 1rem;
    margin-right: 0.5rem;
}

.terms-label {
    color: #4a5568;
}

.link {
    color: #ff7043;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}

.signup-button {
    width: 100%;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ff7043;
    border: 2px solid #f3a566;
    font-weight: bold;
    font-size: 1.5rem;
    transition: background-color 0.3s;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    cursor: pointer;
}

.signup-button:disabled {
    background-color: #a5d6a7;
    border: 2px solid #a5d6a7;
    color: #ffffff;
    opacity: 0.6;
    cursor: not-allowed;
}

.icon {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
}

.floating-icon {
    position: absolute;
    font-size: 28px;
    opacity: 0.8;
    animation: float infinite alternate;
    z-index: 1;
}

@keyframes float {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-30px);
    }
}

.popup-overlay {
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

.popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    font-size: 1.3rem;
}

.popup-button {
    background-color: #4CAF50;
    color: white;
    padding: 15px 35px;
    border: none;
    border-radius: 5px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 30px;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.popup-button:hover {
    background-color: #45a049;
}

.hint-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* .hint-text {
    display: block;
    font-size: 0.8rem;
    color: #718096;
} */

.hint-success {
    display: block;
    color: #2e7d32;
    font-size: 0.8rem;
    /* margin-top: 0.3rem; */
}

.hint-error {
    display: block;
    color: #d32f2f;
    font-size: 0.8rem;
    /* margin-top: 0.3rem; */
}

.email-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    /* 입력 필드와 버튼 간격 */
}

.input-field {
    flex: 1;
    /* 입력 필드가 버튼보다 넓게 */
    padding: 0.5rem;
    font-size: 1rem;
}

.verify-button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
}

.verify-button:hover {
    background-color: #45a049;
}

.verify-button:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
    color: white;
    opacity: 0.6;
}
</style>
