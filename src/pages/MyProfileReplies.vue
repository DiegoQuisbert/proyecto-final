<script setup>
import { onMounted } from 'vue';
import useAuthUserState from '../composables/useAuthUserState';
import useReplies from '../composables/useReplies';

import ProfileLayout from '../components/ProfileLayout.vue';
import ProfileNav from '../components/ProfileNav.vue';
import MainReply from '../components/MainReply.vue';
import MainLoader from '../components/MainLoader.vue';

const { user } = useAuthUserState();
const { replies, loading, fetchUserReplies } = useReplies();

onMounted(() => {
    fetchUserReplies(user.value.id);
});
</script>

<template>
    <ProfileLayout>
        <ProfileNav class="mb-6" />

        <section class="max-w-3xl mx-auto">
            <MainLoader v-if="loading" />
            <MainReply v-else :replies="replies" />
        </section>
    </ProfileLayout>
</template>