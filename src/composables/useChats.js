import { computed, onUnmounted, ref, watch } from 'vue';
import supabase from '../services/supabase';
import { getPrivateChatId } from '../services/private-chat';
import { getFileUrl } from '../services/storage';
import { getUserProfileById } from '../services/user-profiles';

export default function useChats(currentUser) {
	const chats = ref([]);
	const loadingChats = ref(false);
	const search = ref('');
	const error = ref(null);
	let requestId = 0;

	async function fetchChats(userId) {
		const currentRequestId = ++requestId;
		chats.value = [];
		error.value = null;
		loadingChats.value = true;

		try {
			const { data: chatsData, error: chatsError } = await supabase
				.from('private_chats')
				.select('id, user_id1, user_id2, created_at')
				.or(`user_id1.eq.${userId},user_id2.eq.${userId}`);

			if (chatsError) throw chatsError;
			if (currentRequestId !== requestId) return;

			const chatList = [];
			const seenReceiverIds = new Set();

			for (const chat of chatsData) {
				if (currentRequestId !== requestId) return;

				const receiverId = chat.user_id1 === userId ? chat.user_id2 : chat.user_id1;
				if (seenReceiverIds.has(receiverId)) continue;

				try {
					const profile = await getUserProfileById(receiverId);
					if (currentRequestId !== requestId) return;
					if (!profile) continue;

					if (profile.avatar) {
						profile.avatarURL = getFileUrl(profile.avatar, 'avatars');
					}

					const chatId = await getPrivateChatId(userId, receiverId);
					const { data: messages, error: messageError } = await supabase
						.from('private_messages')
						.select('body, created_at')
						.eq('chat_id', chatId)
						.order('created_at', { ascending: false })
						.limit(1);

					if (messageError) throw messageError;
					if (currentRequestId !== requestId) return;
					if (!messages?.length) continue;

					const lastMessage = messages[0];
					chatList.push({
						id: receiverId,
						chat_id: chatId,
						profile,
						lastMessage: lastMessage.body,
						lastDate: lastMessage.created_at,
					});
					seenReceiverIds.add(receiverId);
				} catch (chatError) {
					console.error('[useChats] Error al cargar un chat:', chatError);
					if (currentRequestId === requestId) {
						error.value = 'Algunos chats no se pudieron cargar.';
					}
				}
			}

			if (currentRequestId === requestId) {
				chats.value = chatList.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
			}
		} catch (requestError) {
			if (currentRequestId !== requestId) return;

			console.error('[useChats] Error al cargar la lista de chats:', requestError);
			error.value = 'No se pudo cargar la lista de chats.';
		} finally {
			if (currentRequestId === requestId) {
				loadingChats.value = false;
			}
		}
	}

	watch(() => currentUser.value.id, userId => {
		if (userId) {
			fetchChats(userId);
			return;
		}

		requestId++;
		chats.value = [];
		error.value = null;
		loadingChats.value = false;
	}, { immediate: true });

	onUnmounted(() => requestId++);

	const filteredChats = computed(() => {
		const searchTerm = search.value.toLowerCase();

		return chats.value.filter(chat =>
			chat.profile.display_name?.toLowerCase().includes(searchTerm) ||
			chat.profile.email?.toLowerCase().includes(searchTerm)
		);
	});

	return {
		chats,
		loadingChats,
		search,
		filteredChats,
		error,
	};
}
