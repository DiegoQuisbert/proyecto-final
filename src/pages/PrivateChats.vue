<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import AlertBox from '../components/AlertBox.vue';
import { getPrivateChatLastMessages, listenForPrivateChatMessages, savePrivateChatMessage } from '../services/private-chat';
import useUserProfile from '../composables/useUserProfile';
import useAuthUserState from '../composables/useAuthUserState';
import { useRoute } from 'vue-router';
import PrivateChatList from './PrivateChatList.vue';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loadingUser, error: profileError } = useUserProfile(computed(() => route.params.id));

const { newMessage, sendMessage, sendError } = usePrivateChatForm(userAuth, userChat);
const { messages, loadingMessages, messagesError } = usePrivateChatMessages(userAuth, userChat);

function usePrivateChatMessages(userAuth, userChat) {
    const messages = ref([]);
    const loadingMessages = ref(false);
    const messagesError = ref(null);
    const container = ref(null);
    let unsubscribe = () => {};
    let isUnmounted = false;
    let requestId = 0;

    async function scrollToBottom() {
        await nextTick();
        if (container.value) {
            container.value.scrollTop = container.value.scrollHeight;
        }
    }

    watch(() => [userAuth.value.id, userChat.value.id], async ([senderId, receiverId]) => {
        const currentRequestId = ++requestId;
        unsubscribe();
        unsubscribe = () => {};
        messages.value = [];
        messagesError.value = null;
        loadingMessages.value = Boolean(senderId && receiverId);

        if (!senderId || !receiverId) {
            return;
        }

        try {
            const initialMessages = await getPrivateChatLastMessages(senderId, receiverId);
            if (isUnmounted || currentRequestId !== requestId) return;

            messages.value = initialMessages;
            await scrollToBottom();

            const stopListening = await listenForPrivateChatMessages(senderId, receiverId, async newMessage => {
                if (isUnmounted || currentRequestId !== requestId) return;
                messages.value.push(newMessage);
                await scrollToBottom();
            });

            if (isUnmounted || currentRequestId !== requestId) {
                stopListening();
            } else {
                unsubscribe = stopListening;
            }
        } catch (error) {
            if (isUnmounted || currentRequestId !== requestId) return;

            console.error('[PrivateChats] Error al cargar los mensajes:', error);
            messagesError.value = 'No se pudieron cargar los mensajes. Intentá nuevamente.';
        } finally {
            if (currentRequestId === requestId) {
                loadingMessages.value = false;
            }
        }
    }, { immediate: true });

    onUnmounted(() => {
        isUnmounted = true;
        unsubscribe();
    });

    return {
        messages,
        loadingMessages,
        messagesError,
        container,
    };
}

function usePrivateChatForm(userAuth, userChat) {
    const newMessage = ref({ body: '' });
    const sendError = ref(null);

    async function sendMessage() {
        if (!newMessage.value.body.trim()) return;
        sendError.value = null;
        try {
            await savePrivateChatMessage(
                userAuth.value.id,
                userChat.value.id,
                newMessage.value.body,
            );
            newMessage.value.body = '';
        } catch (error) {
            console.error('[PrivateChats] Error al enviar el mensaje:', error);
            sendError.value = 'No se pudo enviar el mensaje. Intentá nuevamente.';
        }
    }

    return {
        newMessage,
        sendMessage,
        sendError,
    };
}
</script>


<template>
    <PrivateChatList>
        <AlertBox v-if="profileError" :content="{ message: profileError, type: 'error' }" />
        <template v-else-if="!loadingUser">
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

            <AlertBox v-if="messagesError" :content="{ message: messagesError, type: 'error' }" />
            <div ref="container"
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
            <AlertBox v-if="sendError" :content="{ message: sendError, type: 'error' }" />
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