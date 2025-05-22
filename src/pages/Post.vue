<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getPostById } from "../services/posts";
import { getUserProfileById } from "../services/user-profiles";

export default {
    name: "Post",
    components: { MainH1, MainLoader },
    data() {
        return {
            post: null,
            loading: true,
        };
    },
    async mounted() {
        const postId = this.$route.params.id;

        try {
            const postData = await getPostById(postId);
            if (postData) {
                const userProfile = await getUserProfileById(postData.sender_id);
                postData.display_name = userProfile?.display_name || '';
                this.post = postData;
            }
        } catch (error) {
            // TODO...
        } finally {
            this.loading = false;
        }
    }
};
</script>

<template>
    <div class="max-w-xl mx-auto mt-8 p-4 bg-white border rounded shadow">
        <MainH1>
            Publicación de
            <span v-if="post">{{ post.display_name || post.email }}</span>
        </MainH1>

        <MainLoader v-if="loading" />

        <div v-else-if="post">
            <div class="text-gray-800 text-lg whitespace-pre-line mb-3">
                {{ post.body }}
            </div>
            <div class="mb-2 text-gray-600 text-sm">
                Publicado por:
                <span class="font-semibold">{{ post.display_name || post.email }}</span>
                •
                <span>{{ new Date(post.created_at).toLocaleString() }}</span>
            </div>

        </div>
    </div>
</template>
