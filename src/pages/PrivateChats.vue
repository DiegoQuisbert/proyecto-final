<script setup>
import { nextTick, onMounted, ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { getPrivateChatLastMessages, listenForPrivateChatMessages, savePrivateChatMessage } from '../services/private-chat';
import useUserProfile from '../composables/useUserProfile';
import useAuthUserState from '../composables/useAuthUserState';
import { useRoute } from 'vue-router';
import PrivateChatList from './PrivateChatList.vue';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loadingUser } = useUserProfile(route.params.id);

const { newMessage, sendMessage } = usePrivateChatForm(userAuth, userChat);
const { messages, loadingMessages } = usePrivateChatMessages(userAuth, userChat);

function usePrivateChatMessages(userAuth, userChat) {
    const messages = ref([]);
    const loadingMessages = ref(false);
    const container = ref(null);

    async function scrollToBottom() {
        await nextTick();
        if (container.value) {
            container.value.scrollTop = container.value.scrollHeight;
        }
    }

    onMounted(async () => {
        try {
            loadingMessages.value = true;
            messages.value = await getPrivateChatLastMessages(userAuth.value.id, userChat.value.id);
            await scrollToBottom();

            listenForPrivateChatMessages(userAuth.value.id, userChat.value.id, async newMessage => {
                messages.value.push(newMessage);
                await scrollToBottom();
            });
        } catch (error) {
            // TODO
        } finally {
            loadingMessages.value = false;
        }
    });

    return {
        messages,
        loadingMessages,
        container,
    };
}

function usePrivateChatForm(userAuth, userChat) {
    const newMessage = ref({ body: '' });

    async function sendMessage() {
        if (!newMessage.value.body.trim()) return;
        try {
            await savePrivateChatMessage(
                userAuth.value.id,
                userChat.value.id,
                newMessage.value.body,
            );
            newMessage.value.body = '';
        } catch (error) {
            // TODO
        }
    }

    return {
        newMessage,
        sendMessage,
    };
}
</script>


<template>
    <PrivateChatList>
        <template v-if="!loadingUser">
            <div class="flex items-center gap-2">
                <RouterLink to="/mensajes" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                    aria-label="Volver a mensajes">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d" class="w-7 h-7 mr-1"
                        style="flex-shrink: 0;" aria-hidden="true">
                        <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                        <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                    </svg>
                </RouterLink>

                <MainH1>Chat con {{ userChat.display_name }} </MainH1>
            </div>

            <div ref="chatContainer"
                class="flex flex-col h-[75vh] p-4 mb-6 border border-gray-300 rounded-lg bg-white shadow-inner">
                <h2 class="sr-only">Lista de mensajes</h2>

                <ol v-if="!loadingMessages" class="flex-1 overflow-y-auto flex flex-col gap-4 mb-4">
                    <li v-for="message in messages" :key="message.created_at"
                        class="flex flex-col gap-1 p-3 rounded-xl max-w-[75%] shadow-sm" :class="{
                            'self-end bg-blue-100 text-right': message.sender_id == userAuth.id,
                            'self-start bg-gray-100 text-left': message.sender_id != userAuth.id,
                        }">
                        <div class="text-base text-gray-800">{{ message.body }}</div>
                        <div class="text-xs text-gray-500">{{ new Date(message.created_at).toLocaleString() }}</div>
                    </li>
                </ol>

                <MainLoader v-else />

            </div>
            <form action="#" class="flex items-end gap-4" @submit.prevent="sendMessage">
                <div class="w-full">
                    <MainLabel for="body" class="sr-only">Mensaje</MainLabel>
                    <textarea v-model="newMessage.body" id="body" rows="3" placeholder="Escribe tu mensaje..."
                        class="w-full p-3 border border-gray-400 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"></textarea>
                </div>
                <MainButton type="submit" class="h-fit self-end">Enviar</MainButton>
            </form>
        </template>

        <MainLoader v-else />
    </PrivateChatList>
</template>