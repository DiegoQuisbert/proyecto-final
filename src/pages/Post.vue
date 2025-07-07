<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { getFileUrl, uploadFile } from "../services/storage.js";

import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';
import MainButton from '../components/MainButton.vue';
import Layout from '../components/Layout.vue';
import Dropdown from '../components/PostDropdown.vue';
import MainReply from '../components/MainReply.vue';

import { getPostById, saveReply, getRepliesByPostId, handleDeletePost } from "../services/posts";
import { getUserProfileById } from "../services/user-profiles";
import { subscribeToAuthUserChanges } from '../services/auth';

const route = useRoute();
const router = useRouter();

const post = ref(null);
const replies = ref([]);
const newReply = ref('');
const loading = ref(true);
const user = ref({ id: null, email: null });

const replyImageFile = ref({ file: null, preview: null });

function handleReplyFileChange(event) {
    const selected = event.target.files[0];
    if (!selected) {
        if (replyImageFile.value.preview) URL.revokeObjectURL(replyImageFile.value.preview);
        replyImageFile.value = { file: null, preview: null };
        return;
    }
    replyImageFile.value.file = selected;
    replyImageFile.value.preview = URL.createObjectURL(selected);
}

onUnmounted(() => {
    if (replyImageFile.value.preview) URL.revokeObjectURL(replyImageFile.value.preview);
});

async function onDeletePost(postId) {
    try {
        await handleDeletePost(postId);
        router.push('/posts');
    } catch (error) {
        console.error("Error eliminando post:", error);
    }
}

async function sendReply() {
    if (!newReply.value.trim()) return;

    let fileName = null;
    if (replyImageFile.value.file) {
        fileName = `${Date.now()}-${replyImageFile.value.file.name}`;
        await uploadFile(`post_replies/${fileName}`, replyImageFile.value.file, 'post-multimedia');
    }

    try {
        await saveReply({
            post_id: post.value.id,
            sender_id: user.value.id,
            email: user.value.email,
            body: newReply.value,
            multimedia: fileName,
        });

        const freshReplies = await getRepliesByPostId(post.value.id);
        replies.value = await Promise.all(freshReplies.map(async reply => {
            if (reply.multimedia) {
                reply.mediaUrl = getFileUrl(`post_replies/${reply.multimedia}`, 'post-multimedia');
            }
            try {
                const replyProfile = await getUserProfileById(reply.sender_id);
                reply.display_name = replyProfile?.display_name || '';
                reply.avatarURL = replyProfile?.avatar ? getFileUrl(replyProfile.avatar, 'avatars') : null;
                reply.pronouns = replyProfile?.pronouns || '';
            } catch {
                reply.avatarURL = null;
                reply.display_name = '';
                reply.pronouns = '';
            }
            return reply;
        }));

        newReply.value = '';
        if (replyImageFile.value.preview) URL.revokeObjectURL(replyImageFile.value.preview);
        replyImageFile.value = { file: null, preview: null };
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    const postId = route.params.id;

    subscribeToAuthUserChanges(authUser => {
        user.value = authUser;
    });

    try {
        const postData = await getPostById(postId);
        if (postData) {
            const userProfile = await getUserProfileById(postData.sender_id);
            postData.display_name = userProfile?.display_name || '';
            postData.pronouns = userProfile?.pronouns || '';
            postData.avatarURL = userProfile?.avatar ? getFileUrl(userProfile.avatar, 'avatars') : null;

            if (postData.multimedia) {
                postData.mediaUrl = getFileUrl(`post/${postData.multimedia}`, 'post-multimedia');
            }

            post.value = postData;
        }

        const fetchedReplies = await getRepliesByPostId(postId);
        replies.value = await Promise.all(fetchedReplies.map(async reply => {
            if (reply.multimedia) {
                reply.mediaUrl = getFileUrl(`post_replies/${reply.multimedia}`, 'post-multimedia');
            }
            try {
                const replyProfile = await getUserProfileById(reply.sender_id);
                reply.display_name = replyProfile?.display_name || '';
                reply.pronouns = replyProfile?.pronouns || '';
                reply.avatarURL = replyProfile?.avatar ? getFileUrl(replyProfile.avatar, 'avatars') : null;
            } catch {
                reply.avatarURL = null;
                reply.display_name = '';
                reply.pronouns = '';
            }
            return reply;
        }));

        replies.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <Layout>
        <div class="max-w-4xl mx-auto px-4 py-6 bg-white border-gray-200 rounded-xl space-y-6">
            <div class="top-0 flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <RouterLink to="/posts" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                        aria-label="Volver a posts">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d"
                            class="w-7 h-7 mr-1" aria-hidden="true">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                            <path
                                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                        </svg>
                    </RouterLink>

                    <MainH1>Post</MainH1>
                </div>
            </div>

            <MainLoader v-if="loading" />

            <div v-else-if="post" class="space-y-3 relative">

                <div class="flex items-center mb-3">
                    <RouterLink :to="`/usuario/${post.sender_id}`" class="flex items-center gap-3 flex-shrink-0">
                        <div class="w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <img v-if="post.avatarURL" :src="post.avatarURL" alt="Avatar" class="w-full object-cover" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24"
                                class="w-8 h-8">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                            </svg>
                        </div>
                        <div class="flex gap-2 hover:underline items-center">
                            <span class="font-semibold text-gray-900 text-lg">{{ post.display_name }}</span>
                            <span class="text-gray-500 text-sm truncate max-w-xs">@{{ post.email?.split('@')[0]
                                }}</span>
                            <span
                                class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-white border border-gray-500">{{ post.pronouns }}</span>

                        </div>
                    </RouterLink>
                    <Dropdown v-if="post && user.id" :post="post" :currentUserId="user.id" @deletePost="onDeletePost" />
                </div>

                <p class="text-gray-800 text-lg leading-relaxed whitespace-pre-line">{{ post.body }}</p>

                <div v-if="post.mediaUrl" class="w-full overflow-hidden rounded-xl">
                    <img :src="post.mediaUrl" alt="Imagen del post" class="object-contain mx-auto" />
                </div>

                <span class="text-gray-500 text-sm">{{ new Date(post.created_at).toLocaleString() }}</span>
            </div>

            <form @submit.prevent="sendReply" class="space-y-4 border-gray-200">
                <MainLabel for="reply">Tu respuesta</MainLabel>
                <textarea v-model="newReply" id="reply" rows="2" placeholder="Responder..."
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-y focus:border-blue-500 outline-none transition-all leading-normal text-sm"></textarea>

                <div v-if="replyImageFile.preview" class="mt-2 flex justify-center">
                    <img :src="replyImageFile.preview" alt="Vista previa de la imagen" class="h-85 rounded" />
                </div>
                <div class="flex items-center justify-between">
                    <label for="replyFileInput" class="cursor-pointer inline-block text-gray-700 hover:text-blue-600"
                        title="Subir una imagen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </label>
                    <MainButton type="submit">Enviar respuesta</MainButton>
                </div>

                <MainLabel for="replyFileInput" class="sr-only">Subir una imagen</MainLabel>
                <input type="file" id="replyFileInput" class="hidden" accept="image/*"
                    @change="handleReplyFileChange" />
                <MainReply :replies="replies" />
            </form>


        </div>
    </Layout>
</template>