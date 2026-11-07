<script setup>
import { computed } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import AlertBox from '../components/AlertBox.vue';
import useUserProfile from '../composables/useUserProfile';
import useAuthUserState from '../composables/useAuthUserState';
import usePrivateChat from '../composables/usePrivateChat';
import { useRoute } from 'vue-router';
import PrivateChatList from './PrivateChatList.vue';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loadingUser, error: profileError } = useUserProfile(computed(() => route.params.id));

const {
    messages,
    loadingMessages,
    messagesError,
    container,
    newMessage,
    sendMessage,
    sendError,
} = usePrivateChat(userAuth, userChat);
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