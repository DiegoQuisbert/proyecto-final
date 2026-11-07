import { nextTick, onUnmounted, ref, watch } from 'vue';
import { getPrivateChatLastMessages, listenForPrivateChatMessages, savePrivateChatMessage } from '../services/private-chat';

export default function usePrivateChat(userAuth, userChat) {
    const messages = ref([]);
    const loadingMessages = ref(false);
    const messagesError = ref(null);
    const container = ref(null);
    const newMessage = ref({ body: '' });
    const sendError = ref(null);
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

        if (!senderId || !receiverId) return;

        try {
            const initialMessages = await getPrivateChatLastMessages(senderId, receiverId);
            if (isUnmounted || currentRequestId !== requestId) return;

            messages.value = initialMessages;
            await scrollToBottom();

            const stopListening = await listenForPrivateChatMessages(senderId, receiverId, async newMessageData => {
                if (isUnmounted || currentRequestId !== requestId) return;
                messages.value.push(newMessageData);
                await scrollToBottom();
            });

            if (isUnmounted || currentRequestId !== requestId) {
                stopListening();
            } else {
                unsubscribe = stopListening;
            }
        } catch (error) {
            if (isUnmounted || currentRequestId !== requestId) return;

            console.error('[usePrivateChat] Error al cargar los mensajes:', error);
            messagesError.value = 'No se pudieron cargar los mensajes. Intentá nuevamente.';
        } finally {
            if (currentRequestId === requestId) {
                loadingMessages.value = false;
            }
        }
    }, { immediate: true });

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
            console.error('[usePrivateChat] Error al enviar el mensaje:', error);
            sendError.value = 'No se pudo enviar el mensaje. Intentá nuevamente.';
        }
    }

    onUnmounted(() => {
        isUnmounted = true;
        unsubscribe();
    });

    return {
        messages,
        loadingMessages,
        messagesError,
        container,
        newMessage,
        sendMessage,
        sendError,
    };
}
