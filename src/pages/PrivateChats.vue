<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { getPrivateChatLastMessages, listenForPrivateChatMessages, savePrivateChatMessage, } from '../services/private-chat';
import useUserProfile from '../composables/useUserProfile';
import useAuthUserState from '../composables/useAuthUserState';
import { useRoute } from 'vue-router';
import Layout from '../components/Layout.vue';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loadingUser } = useUserProfile(route.params.id);

const { newMessage, sendMessage } = usePrivateChatForm(userAuth, userChat);
const { messages, loadingMessages } = usePrivateChatMessages(userAuth, userChat);

function usePrivateChatMessages(userAuth, userChat) {
    const messages = ref([]);
    const loadingMessages = ref(false);
    const container = useTemplateRef('chatContainer');

    onMounted(async () => {
        try {
            loadingMessages.value = true;
            messages.value = await getPrivateChatLastMessages(userAuth.value.id, userChat.value.id);
            loadingMessages.value = false;

            await nextTick();
            container.value.scrollTop = container.value.scrollHeight;

            listenForPrivateChatMessages(userAuth.value.id, userChat.value.id, async newMessage => {
                messages.value.push(newMessage);
                await nextTick();
                container.value.scrollTop = container.value.scrollHeight;
            });
        } catch (error) {
            //TODO...
        }
        loadingMessages.value = false
    });

    return {
        messages,
        loadingMessages,
    }
}

function usePrivateChatForm(userAuth, userChat) {
    const newMessage = ref({
        body: '',
    });

    async function sendMessage() {
        if (!this.newMessage.body.trim()) return;
        try {
            await savePrivateChatMessage(
                userAuth.value.id,
                userChat.value.id,
                newMessage.value.body,
            );
            newMessage.value.body = '';
        } catch (error) {
            //TODO...
        }
    }

    return {
        newMessage,
        sendMessage,
    }
}
</script>

<template>
    <Layout>
        <template v-if="!loadingUser">
            <MainH1>Conversación privada con {{ userChat.display_name }}</MainH1>

            <div ref="chatContainer"
                class="overflow-y-auto h-[60vh] p-4 mb-6 border border-gray-300 rounded-lg bg-white shadow-inner scroll-smooth">
                <h2 class="sr-only">Lista de mensajes</h2>

                <ol v-if="!loadingMessages" class="flex flex-col gap-4">
                    <li v-for="message in messages" :key="message.created_at"
                        class="flex flex-col gap-1 p-3 rounded-xl max-w-[75%] shadow-sm" :class="{
                            'self-end bg-blue-100 text-right': message.sender_id == userAuth.id,
                            'self-start bg-gray-100 text-left': message.sender_id != userAuth.id,
                        }">
                        <div class="text-base text-gray-800">{{ message.body }}</div>
                        <div class="text-xs text-gray-500">{{ message.created_at }}</div>
                    </li>
                </ol>

                <MainLoader v-else />
            </div>

            <h2 class="sr-only">Enviar un mensaje</h2>
            <form action="#" class="flex items-end gap-4" @submit.prevent="() => sendMessage()">
                <div class="w-full">
                    <MainLabel for="body" class="sr-only">Mensaje</MainLabel>
                    <textarea v-model="newMessage.body" id="body" rows="3" placeholder="Escribe tu mensaje..."
                        class="w-full p-3 border border-gray-400 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"></textarea>
                </div>
                <MainButton type="submit" class="h-fit self-end">Enviar</MainButton>
            </form>
        </template>

        <MainLoader v-else />
    </Layout>
</template>