<script setup>
import { ref, onMounted } from 'vue';
import AlertBox from '../components/AlertBox.vue';
import Layout from '../components/Layout.vue';
import MainH1 from '../components/MainH1.vue';

const feedback = ref({
    message: null,
    type: 'success',
});

onMounted(() => {
    const saved = localStorage.getItem("feedback");
    if (saved) {
        feedback.value = JSON.parse(saved);
    }
});

</script>

<template>
    <Layout>
        <MainH1>Notificaciones</MainH1>
        <AlertBox v-if="feedback.message" :content="feedback" />
    </Layout>
</template>
