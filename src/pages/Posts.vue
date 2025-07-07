<script setup>
import MainLoader from "../components/MainLoader.vue";
import MainPost from "../components/MainPost.vue";
import MainButton from "../components/MainButton.vue";
import Layout from "../components/Layout.vue";
import MainLabel from "../components/MainLabel.vue";

import { onMounted, ref, onUnmounted } from "vue";
import { getLastPosts, listenForPost, savePost, handleDeletePost } from "../services/posts";
import { getUserProfileById } from "../services/user-profiles.js";
import { getFileUrl, uploadFile, deleteFile } from "../services/storage.js";

import useAuthUserState from "../composables/useAuthUserState.js";

const { user } = useAuthUserState();
const { newPost, imageFile, handleFileChange, sendPost } = usePostsForm(user);
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
                        avatarURL = getFileUrl(userProfile.avatar, 'avatars');
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
                    avatarURL = getFileUrl(userProfile.avatar, 'avatars');
                }

                let mediaUrl = null;

                if (receivedPost.multimedia) {
                    mediaUrl = getFileUrl(`post/${receivedPost.multimedia}`,
                        'post-multimedia');
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
    const newPost = ref({
        body: ""
    });
    const imageFile = ref({
        file: null,
        preview: null
    });

    function handleFileChange(event) {
        const selected = event.target.files[0];
        if (!selected) {
            if (imageFile.value.preview) URL.revokeObjectURL(imageFile.value.preview);
            imageFile.value = {
                file: null,
                preview: null
            };
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
        imageFile.value = {
            file: null,
            preview: null
        };
    }

    return {
        newPost,
        imageFile,
        handleFileChange,
        sendPost,
    };
}
</script>

<template>
    <Layout>

        <!-- El uso del ul es méramente estético -->
        <ul class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex">
            <li class="w-full focus-within:z-10">
                <a href="#"
                    class="inline-block w-full p-4 text-gray-900 border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none"
                    aria-current="page">Para tí</a>
            </li>
            <li class="w-full focus-within:z-10">
                <a href="#"
                    class="inline-block w-full p-4 text-gray-900 border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none"
                    aria-current="page">Siguiendo</a>
            </li>
        </ul>

        <form @submit.prevent="sendPost" class="max-w-4xl mx-auto p-4 mt-3 mb-3 rounded bg-white">

            <div class="flex items-start gap-4 mb-4">
                <div
                    class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <RouterLink to="/mi-perfil">
                        <img v-if="user.avatar" :src="getFileUrl(user.avatar, 'avatars')" alt="Avatar" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" class="w-8 h-8">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                        </svg>
                    </RouterLink>
                </div>
                <MainLabel for="body" class="sr-only">Subir una publicación</MainLabel>
                <textarea v-model="newPost.body" id="body" placeholder="¿Qué vas a subir hoy?"
                    class="w-full h-13 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    rows="3"></textarea>
            </div>
            <div class="mt-4 flex justify-center" v-if="imageFile.preview">
                <img :src="imageFile.preview" alt="Vista previa"
                    class="max-h-60 rounded border border-gray-300 object-contain" />
            </div>
            <MainLabel for="fileInput" class="sr-only">Subir una imágen</MainLabel>
            <input type="file" id="fileInput" class="hidden" @change="handleFileChange" />
            <div class="flex items-center justify-between mt-4 gap-4">
                <label for="fileInput" class="cursor-pointer text-[#2d3c7d] hover:text-[#2d3c7d]/50 pl-[4rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </label>

                <MainButton type="submit"> Subir </MainButton>
            </div>
        </form>
        <hr class="w-full h-1 mx-auto my-4 bg-[#DCDAED] border-0 rounded-sm">
        <div class="max-w-3xl mx-auto p-4 mt-3 mb-3 rounded">
            <MainLoader v-if="loadingPost" />
            <ul v-else class="flex flex-col gap-4">
                <MainPost v-for="post in posts" :key="post.id" :post="post" :currentUserId="user.id"
                    @handleDeletePost="deletePostById" />
            </ul>
        </div>
    </Layout>
</template>