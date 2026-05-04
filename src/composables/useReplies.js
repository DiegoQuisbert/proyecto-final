import { ref, onMounted, onUnmounted } from 'vue';
import { getRepliesBySenderId, handleDeleteReply } from '../services/posts';
import { getUserProfileById } from '../services/user-profiles';
import { getFileUrl, deleteFile } from '../services/storage';

export default function useReplies() {
    const replies = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Función para enriquecer una reply con datos de perfil y multimedia
    const enrichReply = async (reply) => {
        try {
            const userProfile = await getUserProfileById(reply.sender_id);

            let avatarURL = null;
            if (userProfile?.avatar) {
                avatarURL = getFileUrl(userProfile.avatar, 'avatars');
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
        } catch (err) {
            console.error('Error enriching reply:', err);
            return reply; // Retornar reply sin enriquecer si falla
        }
    };

    // Fetch replies de un usuario específico
    const fetchUserReplies = async (userId) => {
        loading.value = true;
        error.value = null;
        try {
            const rawReplies = await getRepliesBySenderId(userId);
            const enrichedReplies = await Promise.all(rawReplies.map(enrichReply));
            replies.value = enrichedReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (err) {
            error.value = err.message || 'Error al cargar replies';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Eliminar una reply
    const deleteReply = async (id) => {
        try {
            await handleDeleteReply(id);
            replies.value = replies.value.filter(r => r.id !== id);
        } catch (err) {
            error.value = err.message || 'Error al eliminar reply';
            console.error(err);
        }
    };

    return {
        replies,
        loading,
        error,
        fetchUserReplies,
        deleteReply,
    };
}