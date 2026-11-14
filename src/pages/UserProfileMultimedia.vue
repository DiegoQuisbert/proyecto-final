<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import usePosts from '../composables/usePosts';
import MainPost from '../components/MainPost.vue';
import MainLoader from '../components/MainLoader.vue';

const route = useRoute();
const { posts, loading, fetchUserPosts } = usePosts();

const multimediaPosts = computed(() => {
    return posts.value.filter(post => post.multimedia);
});

onMounted(() => {
    fetchUserPosts(route.params.id);
});
</script>

<template>
    <section>
        <MainLoader v-if="loading" />
        <ul v-else class="flex flex-col gap-4">
            <MainPost v-for="post in multimediaPosts" :key="post.id" :post="post" />
        </ul>
    </section>
</template>