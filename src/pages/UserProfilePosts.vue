<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import usePosts from '../composables/usePosts';
import useAuthUserState from '../composables/useAuthUserState';
import MainPost from '../components/MainPost.vue';
import MainLoader from '../components/MainLoader.vue';

const route = useRoute();
const { user } = useAuthUserState();
const { posts, loading, fetchUserPosts } = usePosts();

watch(() => route.params.id, (newId) => {
    if (newId) {
        fetchUserPosts(newId);
    }
}, { immediate: true });
</script>

<template>
    <section>
        <MainLoader v-if="loading" />
        <ul v-else class="flex flex-col gap-4">
            <MainPost v-for="post in posts" :key="post.id" :post="post" :currentUserId="user.id" />
        </ul>
    </section>
</template>