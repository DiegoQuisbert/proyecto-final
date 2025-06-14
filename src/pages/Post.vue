<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import { getPostById, saveReply, getRepliesByPostId } from "../services/posts";
import { getUserProfileById } from "../services/user-profiles";
import { subscribeToAuthUserChanges } from '../services/auth';

export default {
    name: "Post",
    components: { MainH1, MainLabel, MainLoader, MainButton, },
    data() {
        return {
            post: null,
            replies: [],
            newReply: '',
            loading: true,
            user: {
                id: null,
                email: null,
            }
        };
    },
    async mounted() {
        const postId = this.$route.params.id;

        subscribeToAuthUserChanges(user => {
            this.user = user;
        });

        try {
            const postData = await getPostById(postId);
            if (postData) {
                const userProfile = await getUserProfileById(postData.sender_id);
                postData.display_name = userProfile?.display_name || '';
                this.post = postData;
            }

            this.replies = await getRepliesByPostId(postId);
        } catch (error) {
            //TODO...
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async sendReply() {
            if (!this.newReply.trim()) return;

            try {
                await saveReply({
                    post_id: this.post.id,
                    sender_id: this.user.id,
                    email: this.user.email,
                    body: this.newReply,
                });

                this.replies = await getRepliesByPostId(this.post.id);
                this.newReply = '';
            } catch (error) {
                //TODO...
            }
        }
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-lg space-y-6">

        <MainH1>
            Publicación de
            <span v-if="post">
                {{ post.display_name || post.email }}
            </span>
        </MainH1>

        <MainLoader v-if="loading" />

        <div v-else-if="post" class="space-y-3">
            <p class="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {{ post.body }}
            </p>
            <div class="text-sm text-gray-500">
                <span>{{ new Date(post.created_at) }}</span>
            </div>
        </div>

        <form 
            @submit.prevent="sendReply" 
            class="space-y-3 pt-4 border-t border-gray-200"
        >
            <MainLabel for="reply">Tu respuesta</MainLabel>
            <textarea 
                v-model="newReply" 
                id="reply" 
                rows="4" 
                placeholder="Responder..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-none focus:border-blue-500 outline-none transition-all"
                ></textarea>

            <div class="text-right">
                <MainButton type="submit">
                    Responder
                </MainButton>
            </div>
        </form>

        <div class="pt-6 border-t border-gray-200 space-y-4">
            <h2 class="text-xl font-semibold text-gray-800">Respuestas</h2>

            <ul class="space-y-3">
                <li v-for="reply in replies" :key="reply.id"
                    class="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-1">
                    <p class="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{{ reply.body }}</p>
                    <div class="text-xs text-gray-500">
                        Por <span class="font-medium">{{ reply.email }}</span> •
                        {{ new Date(reply.created_at) }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>