<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useReplies from '../composables/useReplies';
import MainReply from '../components/MainReply.vue';
import MainLoader from '../components/MainLoader.vue';

const route = useRoute();
const { replies, loading, fetchUserReplies } = useReplies();

onMounted(() => {
    fetchUserReplies(route.params.id);
});
</script>

<template>
    <section>
        <MainLoader v-if="loading" />
        <MainReply v-else :replies="replies" />
    </section>
</template>