<script setup>
import { onMounted, ref } from "vue";
import MainLoader from "../components/MainLoader.vue";
import MainPost from "../components/MainPost.vue";
import MainButton from "../components/MainButton.vue";
import { getLastPosts, listenForPost, savePost, handleDeletePost } from "../services/posts";
import { getUserProfileById } from '../services/user-profiles.js';
import useAuthUserState from "../composables/useAuthUserState.js";
import Layout from "../components/Layout.vue";

const { user } = useAuthUserState();
const { newPost, sendPost } = usePostsForm(user);
const { posts, loadingPost, deletePostById } = usePosts();

function usePosts() {
    const posts = ref([]);
    const loadingPost = ref(false);

    onMounted(async () => {
        try {
            loadingPost.value = true;

            const rawPosts = await getLastPosts();
            const postsWithNames = await Promise.all(
                rawPosts.map(async post => {
                    const userProfile = await getUserProfileById(post.sender_id);
                    return {
                        ...post,
                        display_name: userProfile?.display_name || "",
                    };
                })
            );

            posts.value = postsWithNames.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            loadingPost.value = false;

            listenForPost(async receivedPost => {
                const userProfile = await getUserProfileById(receivedPost.sender_id);
                receivedPost.display_name = userProfile?.display_name || '';
                posts.value.unshift(receivedPost);
            });
        } catch (error) {
            // TODO: Manejar errores
        } finally {
            loadingPost.value = false;
        }
    });


    async function deletePostById(id) {
        try {
            await handleDeletePost(id);
            posts.value = posts.value.filter((p) => p.id !== id);
        } catch (error) {
            console.error(error);
        }
    }

    return {
        posts,
        loadingPost,
        deletePostById,
    };
}


function usePostsForm(user) {
    const newPost = ref({
        body: '',
    });

    async function sendPost() {
        if (!this.newPost.body.trim()) return;
        savePost({
            sender_id: user.value.id,
            email: user.value.email,
            body: newMessage.value.body,
        });
    }

    return {
        newPost,
        sendPost,
    }
}
</script>

<template>

    <Layout>
        <form @submit.prevent="sendPost"
            class="mt-8 mb-8 border border-gray-300 rounded p-4 bg-white shadow max-w-xl mx-auto">
            <h2 class="mb-4 text-xl font-semibold">¿Qué vas a subir hoy?</h2>

            <div class="mb-4 flex items-center gap-2 text-gray-600">
                <span class="font-bold">{{ user.email }}</span>
            </div>

            <textarea v-model="newPost.body" id="body" placeholder="Escribe tu post aquí..."
                class="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                rows="3"></textarea>

            <div class="text-right mt-2">
                <MainButton type="submit">
                    Subir
                </MainButton>
            </div>
        </form>

        <section class="max-w-xl mx-auto">
            <MainLoader v-if="loadingPost" />

            <ol v-else class="flex flex-col gap-4">
                <MainPost v-for="post in posts" :key="post.id" :post="post" @handleDeletePost="deletePostById" />
            </ol>
        </section>

    </Layout>
</template>