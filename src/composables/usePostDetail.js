import { onUnmounted, ref, toValue, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getFileUrl, uploadFile } from '../services/storage';
import { getPostById, saveReply, getRepliesByPostId, handleDeletePost } from '../services/posts';
import { getUserProfileById } from '../services/user-profiles';

export default function usePostDetail(postId, user) {
    const router = useRouter();
    const post = ref(null);
    const replies = ref([]);
    const newReply = ref('');
    const loading = ref(true);
    const replyImageFile = ref({ file: null, preview: null });
    let requestId = 0;

    function clearReplyImage() {
        if (replyImageFile.value.preview) {
            URL.revokeObjectURL(replyImageFile.value.preview);
        }
        replyImageFile.value = { file: null, preview: null };
    }

    async function enrichReply(reply) {
        const enrichedReply = { ...reply };

        if (reply.multimedia) {
            enrichedReply.mediaUrl = getFileUrl(`post_replies/${reply.multimedia}`, 'post-multimedia');
        }

        try {
            const replyProfile = await getUserProfileById(reply.sender_id);
            enrichedReply.display_name = replyProfile?.display_name || '';
            enrichedReply.avatarURL = replyProfile?.avatar ? getFileUrl(replyProfile.avatar, 'avatars') : null;
            enrichedReply.pronouns = replyProfile?.pronouns || '';
        } catch (error) {
            console.error('[usePostDetail] Error al cargar el perfil de una respuesta:', error);
            enrichedReply.avatarURL = null;
            enrichedReply.display_name = '';
            enrichedReply.pronouns = '';
        }

        return enrichedReply;
    }

    watch(() => toValue(postId), async currentPostId => {
        const currentRequestId = ++requestId;
        post.value = null;
        replies.value = [];
        newReply.value = '';
        clearReplyImage();
        loading.value = true;

        try {
            const postData = await getPostById(currentPostId);
            if (currentRequestId !== requestId) return;

            const [postProfile, fetchedReplies] = await Promise.all([
                getUserProfileById(postData.sender_id),
                getRepliesByPostId(currentPostId),
            ]);
            if (currentRequestId !== requestId) return;

            post.value = {
                ...postData,
                display_name: postProfile?.display_name || '',
                pronouns: postProfile?.pronouns || '',
                avatarURL: postProfile?.avatar ? getFileUrl(postProfile.avatar, 'avatars') : null,
                mediaUrl: postData.multimedia
                    ? getFileUrl(`post/${postData.multimedia}`, 'post-multimedia')
                    : null,
            };

            const enrichedReplies = await Promise.all(fetchedReplies.map(enrichReply));
            if (currentRequestId !== requestId) return;

            replies.value = enrichedReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            if (currentRequestId === requestId) {
                console.error('[usePostDetail] Error al cargar el post:', error);
            }
        } finally {
            if (currentRequestId === requestId) {
                loading.value = false;
            }
        }
    }, { immediate: true });

    function handleReplyFileChange(event) {
        const selectedFile = event.target.files[0];
        clearReplyImage();

        if (selectedFile) {
            replyImageFile.value = {
                file: selectedFile,
                preview: URL.createObjectURL(selectedFile),
            };
        }
    }

    async function sendReply() {
        if (!newReply.value.trim() || !post.value) return;

        const currentPost = post.value;
        let fileName = null;

        try {
            if (replyImageFile.value.file) {
                fileName = `${Date.now()}-${replyImageFile.value.file.name}`;
                await uploadFile(`post_replies/${fileName}`, replyImageFile.value.file, 'post-multimedia');
            }

            await saveReply({
                post_id: currentPost.id,
                sender_id: user.value.id,
                email: user.value.email,
                body: newReply.value,
                multimedia: fileName,
            });

            if (post.value?.id !== currentPost.id) return;

            const freshReplies = await getRepliesByPostId(currentPost.id);
            replies.value = await Promise.all(freshReplies.map(enrichReply));
            newReply.value = '';
            clearReplyImage();
        } catch (error) {
            console.error('[usePostDetail] Error al enviar la respuesta:', error);
        }
    }

    async function deletePost(postToDeleteId) {
        try {
            await handleDeletePost(postToDeleteId);
            router.push('/posts');
        } catch (error) {
            console.error('[usePostDetail] Error al eliminar el post:', error);
        }
    }

    onUnmounted(() => {
        requestId++;
        clearReplyImage();
    });

    return {
        post,
        replies,
        newReply,
        loading,
        replyImageFile,
        handleReplyFileChange,
        sendReply,
        deletePost,
    };
}
