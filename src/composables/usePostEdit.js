import { ref, toValue, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getPostById, EditPost } from '../services/posts';

export default function usePostEdit(postId, user) {
    const router = useRouter();
    const post = ref({ id: null, body: '', sender_id: null });
    const loadingPost = ref(true);
    const editingPost = ref(false);
    const error = ref(null);
    let requestId = 0;

    watch(() => [toValue(postId), user.value.id], async ([currentPostId, currentUserId]) => {
        const currentRequestId = ++requestId;
        error.value = null;
        loadingPost.value = true;

        if (!currentPostId || !currentUserId) return;

        try {
            const postData = await getPostById(currentPostId);
            if (currentRequestId !== requestId) return;

            if (postData.sender_id !== currentUserId) {
                router.push('/posts');
                return;
            }

            post.value = postData;
        } catch (requestError) {
            if (currentRequestId !== requestId) return;

            console.error('[usePostEdit] Error al cargar el post:', requestError);
            error.value = 'No se pudo cargar el post. Intentá nuevamente.';
        } finally {
            if (currentRequestId === requestId) {
                loadingPost.value = false;
            }
        }
    }, { immediate: true });

    async function handleEditPost() {
        if (!post.value.id || editingPost.value) return;

        error.value = null;
        editingPost.value = true;
        try {
            await EditPost(post.value.id, { body: post.value.body });
            router.push('/posts');
        } catch (requestError) {
            console.error('[usePostEdit] Error al editar el post:', requestError);
            error.value = 'No se pudo guardar el post. Intentá nuevamente.';
        } finally {
            editingPost.value = false;
        }
    }

    return {
        post,
        loadingPost,
        editingPost,
        error,
        handleEditPost,
    };
}
