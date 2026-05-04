<script setup>
import { onMounted } from 'vue';
import usePosts from '../composables/usePosts';
import useAuthUserState from '../composables/useAuthUserState';

import ProfileLayout from '../components/ProfileLayout.vue';
import ProfileNav from '../components/ProfileNav.vue';
import MainPost from '../components/MainPost.vue';
import MainLoader from '../components/MainLoader.vue';

const { user } = useAuthUserState();
const { posts, loading, fetchUserPosts, deletePost } = usePosts();

onMounted(() => {
    fetchUserPosts(user.value.id);
});
</script>

<template>
    <ProfileLayout>
        <ProfileNav class="mb-6"/>
        <section class="max-w-3xl mx-auto">
            <MainLoader v-if="loading" />
            <ul v-else class="flex flex-col gap-4">
                <MainPost v-for="post in posts" :key="post.id" :post="post" :currentUserId="user.id"
                    @handleDeletePost="deletePost" />
            </ul>
        </section>
    </ProfileLayout>
</template>