<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuthUserChanges } from '../services/auth';
import { getUserProfileById } from '../services/user-profiles';
import {
    getPrivateChatLastMessages,
    listenForPrivateChatMessages,
    savePrivateChatMessage,
} from '../services/private-chat';

export default {
    name: 'PrivateChat',
    components: { MainH1, MainLoader, MainLabel, MainButton },
    data() {
        return {
            userAuth: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                pronoums: null,
            },
            userChat: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                pronoums: null,
            },
            loadingUser: false,
            messages: [],
            loadingMessages: false,
            newMessage: {
                body: '',
            },
        };
    },
    methods: {
        async sendMessage() {
            try {
                savePrivateChatMessage(
                    this.userAuth.id,
                    this.userChat.id,
                    this.newMessage.body,
                );
                this.newMessage.body = '';
            } catch (error) {
                // TODO: manejar errores
            }
        },
    },
    async mounted() {
        subscribeToAuthUserChanges(newUserState => this.userAuth = newUserState);

        try {
            this.loadingUser = true;
            this.loadingMessages = true;

            this.userChat = await getUserProfileById(this.$route.params.id);
            this.loadingUser = false;

            this.messages = await getPrivateChatLastMessages(
                this.userAuth.id,
                this.$route.params.id,
            );
            this.loadingMessages = false;

            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

            listenForPrivateChatMessages(
                this.userAuth.id,
                this.$route.params.id,
                async newMessage => {
                    this.messages.push(newMessage);
                    await nextTick();
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                },
            );
        } catch (error) {
            // TODO: manejar errores
        }
    },
};
</script>

<template>
    <template v-if="!loadingUser">
        <MainH1>Conversación privada con {{ userChat.email }}</MainH1>

        <!-- Contenedor del chat -->
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

        <!-- Formulario -->
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
</template>