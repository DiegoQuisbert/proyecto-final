<script setup>
import { ref, onMounted } from 'vue';
import useAuthUserState from '../composables/useAuthUserState';

import ProfileLayout from '../components/ProfileLayout.vue';
import ProfileNav from '../components/ProfileNav.vue';
import MainReply from '../components/MainReply.vue';
import MainLoader from '../components/MainLoader.vue';

import { getRepliesBySenderId } from '../services/posts';
import { getUserProfileById } from '../services/user-profiles';
import { getFileUrl } from '../services/storage';

const { user } = useAuthUserState();
const replies = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;

    try {
        const rawReplies = await getRepliesBySenderId(user.value.id);

        const repliesWithProfile = await Promise.all(
            rawReplies.map(async (reply) => {
                const userProfile = await getUserProfileById(reply.sender_id);

                let avatarURL = null;
                if (userProfile?.avatar) {
                    avatarURL = getFileUrl(userProfile.avatar);
                }

                let mediaUrl = null;
                if (reply.multimedia) {
                    mediaUrl = getFileUrl(`post_replies/${reply.multimedia}`, 'post-multimedia');
                }

                return {
                    ...reply,
                    display_name: userProfile?.display_name || '',
                    pronouns: userProfile?.pronouns || '',
                    avatarURL,
                    mediaUrl,
                };
            })
        );

        replies.value = repliesWithProfile.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <ProfileLayout>
        <ProfileNav class="mb-6" />

        <section class="max-w-xl mx-auto">
            <MainLoader v-if="loading" />
            <MainReply v-else :replies="replies" />
        </section>
    </ProfileLayout>
</template>