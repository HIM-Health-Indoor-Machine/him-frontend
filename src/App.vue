<script setup>
import { RouterView, useRoute } from 'vue-router';
import { watch, ref } from 'vue';
import Header from './components/HeaderNav.vue'

const route = useRoute();
const showHeader = ref(false);

watch(
  () => route.name,
  (newRouteName) => {
    showHeader.value = ['ChallengeSelectView', 'GameSelectView', 'FailScreen', 'SuccessScreen', 'ChallengeSuccessScreen'].includes(newRouteName);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <Header v-if="showHeader" ></Header>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
