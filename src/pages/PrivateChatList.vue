<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Layout from '../components/Layout.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';

import supabase from '../services/supabase';
import useAuthUserState from '../composables/useAuthUserState';
import { getUserProfileById } from '../services/user-profiles';
import { getFileUrl } from '../services/storage';

import { getPrivateChatId } from '../services/private-chat';

const router = useRouter();
const { user: currentUser } = useAuthUserState();

const chats = ref([]);
const loadingChats = ref(true);
const search = ref('');

onMounted(async () => {
    loadingChats.value = true;

    try {
        const { data: chatsData, error: chatsError } = await supabase
            .from('private_chats')
            .select('id, user_id1, user_id2, created_at')
            .or(`user_id1.eq.${currentUser.value.id},user_id2.eq.${currentUser.value.id}`);

        if (chatsError) throw chatsError;

        const chatList = [];
        const seenReceiverIds = new Set();

        for (const chat of chatsData) {
            const receiverId = chat.user_id1 === currentUser.value.id ? chat.user_id2 : chat.user_id1;
            if (seenReceiverIds.has(receiverId)) continue;

            try {
                const profile = await getUserProfileById(receiverId);
                if (!profile) continue;

                if (profile.avatar) {
                    profile.avatarURL = getFileUrl(profile.avatar, 'avatars');
                }

                const chat_id = await getPrivateChatId(currentUser.value.id, receiverId);

                const { data: messages, error: msgError } = await supabase
                    .from('private_messages')
                    .select('body, created_at')
                    .eq('chat_id', chat_id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (msgError) throw msgError;
                if (!messages || messages.length === 0) continue;

                const lastMsg = messages[0];

                chatList.push({
                    id: receiverId,
                    chat_id,
                    profile,
                    lastMessage: lastMsg.body,
                    lastDate: lastMsg.created_at,
                });

                seenReceiverIds.add(receiverId);
            } catch (error) {
                console.error('Error cargando chat: ', error);
            }
        }

        chats.value = chatList.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    } catch (error) {
        console.error('Error cargando lista de chats:', error);
    } finally {
        loadingChats.value = false;
    }
});

const filteredChats = computed(() => {
    return chats.value.filter(chat =>
        chat.profile.display_name?.toLowerCase().includes(search.value.toLowerCase()) ||
        chat.profile.email?.toLowerCase().includes(search.value.toLowerCase())
    );
});

function goToChat(id) {
    router.push(`/mensajes/${id}/chat`);
}
</script>

<template>
    <Layout :showAside="false">

        <div class="flex h-full">
            <div class="w-1/2 border-r border-gray-300 overflow-y-auto p-4">
                <div class="flex items-center gap-2">
                    <RouterLink to="/posts" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                        aria-label="Volver a posts">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d"
                            class="w-7 h-7 mr-1" style="flex-shrink: 0;" aria-hidden="true">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                            <path
                                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                        </svg>
                    </RouterLink>

                    <MainH1>Mensajes</MainH1>
                </div>
                <MainLabel for="search">Buscar chat</MainLabel>
                <input id="search" v-model="search" type="text"
                    class="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Buscar por nombre o email" />

                <MainLoader v-if="loadingChats" />

                <ul v-else class="flex flex-col divide-y divide-gray-200">
                    <li v-for="chat in filteredChats" :key="chat.id"
                        class="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 rounded"
                        @click="goToChat(chat.id)">
                        <img v-if="chat.profile.avatarURL" :src="chat.profile.avatarURL" alt="Avatar"
                            class="w-12 h-12 rounded-full object-cover" />
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-gray-900">
                                {{ chat.profile.display_name }}
                                <span class="text-gray-500 font-normal text-xs">
                                    @{{ chat.profile.email?.split('@')[0] }}
                                </span>
                            </div>
                            <div class="text-sm text-gray-600 truncate">{{ chat.lastMessage }}</div>
                        </div>
                        <div class="text-xs text-gray-500 whitespace-nowrap">
                            {{ chat.lastDate ? new Date(chat.lastDate).toLocaleDateString('es-AR', {
                                day: '2-digit', month: '2-digit'
                            }) : '' }}
                        </div>
                    </li>
                </ul>
            </div>

            <div class="w-1/2 overflow-y-auto p-4">
                <div class="max-w-full">
                    <slot />
                </div>
            </div>
        </div>
    </Layout>
</template>