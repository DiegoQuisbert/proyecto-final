<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import MainLoader from "../components/MainLoader.vue";
import MainPost from "../components/MainPost.vue";
import MainButton from "../components/MainButton.vue";
import {
    getLastPosts,
    listenForPost,
    savePost,
    handleDeletePost,
    EditPost,
} from "../services/posts";
import { getUserProfileById } from "../services/user-profiles.js";
import { getFileUrl, uploadFile, deleteFile } from "../services/storage.js";
import useAuthUserState from "../composables/useAuthUserState.js";
import Layout from "../components/Layout.vue";

const { user } = useAuthUserState();
const { newPost, imageFile, editing, handleFileChange, sendPost } = usePostsForm(user);
const { posts, loadingPost, deletePostById } = usePosts();

function usePosts() {
    const posts = ref([]);
    const loadingPost = ref(false);

    onMounted(async () => {
        loadingPost.value = true;

        try {
            const rawPosts = await getLastPosts();

            const postsWithNames = await Promise.all(
                rawPosts.map(async (post) => {
                    const userProfile = await getUserProfileById(post.sender_id);

                    let avatarURL = null;
                    if (userProfile?.avatar) {
                        avatarURL = getFileUrl(userProfile.avatar);
                    }

                    let mediaUrl = null;
                    if (post.multimedia) {
                        mediaUrl = getFileUrl(`post/${post.multimedia}`, 'post-multimedia');
                    }

                    return {
                        ...post,
                        display_name: userProfile?.display_name || "",
                        pronouns: userProfile?.pronouns || "",
                        avatarURL,
                        mediaUrl,
                    };
                })
            );
            posts.value = postsWithNames.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            listenForPost(async (receivedPost) => {
                const userProfile = await getUserProfileById(receivedPost.sender_id);

                let avatarURL = null;
                if (userProfile?.avatar) {
                    avatarURL = getFileUrl(userProfile.avatar);
                }

                let mediaUrl = null;
                if (receivedPost.multimedia) {
                    mediaUrl = getFileUrl(`post/${receivedPost.multimedia}`, 'post-multimedia');
                }

                receivedPost.display_name = userProfile?.display_name || '';
                receivedPost.pronouns = userProfile?.pronouns || '';
                receivedPost.avatarURL = avatarURL;
                receivedPost.mediaUrl = mediaUrl;

                posts.value.unshift(receivedPost);
            });
        } catch (error) {
            console.error(error);
        } finally {
            loadingPost.value = false;
        }
    });

    async function deletePostById(id) {
        try {
            const postToDelete = posts.value.find(p => p.id === id);
            if (postToDelete?.multimedia) {
                await deleteFile(`post/${postToDelete.multimedia}`, 'post-multimedia');
            }

            await handleDeletePost(id);
            posts.value = posts.value.filter(p => p.id !== id);
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
    const newPost = ref({ body: "" });
    const imageFile = ref({ file: null, preview: null });
    const editing = ref(false);

    function handleFileChange(event) {
        const selected = event.target.files[0];
        if (!selected) {
            if (imageFile.value.preview) URL.revokeObjectURL(imageFile.value.preview);
            imageFile.value = { file: null, preview: null };
            return;
        }
        imageFile.value.file = selected;
        imageFile.value.preview = URL.createObjectURL(selected);
    }

    onUnmounted(() => {
        if (imageFile.value.preview) URL.revokeObjectURL(imageFile.value.preview);
    });

    async function sendPost() {
        if (!newPost.value.body.trim()) return;

        let fileName = null;
        if (imageFile.value.file) {
            fileName = `${Date.now()}-${imageFile.value.file.name}`;
            await uploadFile(`post/${fileName}`, imageFile.value.file, 'post-multimedia');
        }

        await savePost({
            sender_id: user.value.id,
            email: user.value.email,
            body: newPost.value.body,
            multimedia: fileName,
        });

        newPost.value.body = "";
        imageFile.value = { file: null, preview: null };
    }

    return {
        newPost,
        imageFile,
        editing,
        handleFileChange,
        sendPost,
    };
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
                rows="3" />

            <input type="file" id="fileInput" class="hidden" @change="handleFileChange" />

            <div class="flex items-center justify-between mt-4 gap-4">
                <label for="fileInput" class="cursor-pointer text-gray-700 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </label>

                <MainButton type="submit"> Subir </MainButton>
            </div>

            <div class="mt-4" v-if="imageFile.preview">
                <img :src="imageFile.preview" alt="Vista previa"
                    class="max-h-60 rounded border border-gray-300 object-contain" />
            </div>

        </form>

        <section class="max-w-xl mx-auto">
            <MainLoader v-if="loadingPost" />
            <ol v-else class="flex flex-col gap-4">
                <MainPost v-for="post in posts" :key="post.id" :post="post" :currentUserId="user.id"
                    @handleDeletePost="deletePostById" />
            </ol>
        </section>
    </Layout>
</template>
