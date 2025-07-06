<script setup>
import { ref, onMounted } from 'vue';
import useAuthUserState from '../composables/useAuthUserState';

import ProfileLayout from '../components/ProfileLayout.vue';
import ProfileNav from '../components/ProfileNav.vue';
import MainPost from '../components/MainPost.vue';
import MainLoader from '../components/MainLoader.vue';

import { getPostsByUserId, handleDeletePost } from '../services/posts';
import { getUserProfileById } from '../services/user-profiles';
import { getFileUrl, deleteFile } from '../services/storage';

const { user } = useAuthUserState();
const posts = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;

    try {
        const rawPosts = await getPostsByUserId(user.value.id);

        const postsWithProfile = await Promise.all(
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

        posts.value = postsWithProfile.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
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
</script>

<template>
    <ProfileLayout>
        <ProfileNav class="mb-6"/>
        <section class="max-w-xl mx-auto">
            <MainLoader v-if="loading" />
            <ul v-else class="flex flex-col gap-4">
                <MainPost v-for="post in posts" :key="post.id" :post="post" :currentUserId="user.id"
                    @handleDeletePost="deletePostById" />
            </ul>
        </section>
    </ProfileLayout>
</template>