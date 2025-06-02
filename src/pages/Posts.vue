<script>
import { nextTick } from "vue";
import MainH1 from "../components/MainH1.vue";
import MainLoader from "../components/MainLoader.vue";
import MainLabel from "../components/MainLabel.vue";
import MainPost from "../components/MainPost.vue";
import MainButton from "../components/MainButton.vue";
import { getLastPosts, listenForPost, savePost } from "../services/posts";
import { subscribeToAuthUserChanges } from "../services/auth";
import { getUserProfileById } from '../services/user-profiles.js';

export default {
    name: "Posts",
    components: { MainH1, MainLoader, MainLabel, MainPost, MainButton, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
            },
            posts: [],
            loadingPost: false,
            newPost: {
                body: '',
            },
        };
    },
    methods: {
        async sendPost() {
            try {
                savePost({
                    sender_id: this.user.id,
                    email: this.user.email,
                    body: this.newPost.body,
                });
                this.newPost.body = '';
            } catch (error) {
                //TODO...
            }
        },
    },
    async mounted() {
        subscribeToAuthUserChanges(newUserState => this.user = newUserState);

        listenForPost(async receivedPost => {
            const userProfile = await getUserProfileById(receivedPost.sender_id);
            receivedPost.display_name = userProfile?.display_name || '';
            this.posts.unshift(receivedPost);
            await nextTick();
        });

        try {
            this.loadingPost = true;
            let posts = await getLastPosts();

            const postsWithNames = await Promise.all(posts.map(async post => {
                const userProfile = await getUserProfileById(post.sender_id);
                return { ...post, display_name: userProfile?.display_name || '' };
            }));

            this.posts = postsWithNames.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            this.loadingPost = false;
        } catch (error) {
            //TODO...
        }
    }

}
</script>

<template>

    <MainH1>Publicaciones</MainH1>

    <form @submit.prevent="sendPost" class="mb-8 border border-gray-300 rounded p-4 bg-white shadow max-w-xl mx-auto">
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
            <MainPost v-for="post in posts" :key="post.id" :post="post" />
        </ol>
    </section>


</template>