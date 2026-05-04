import { ref, onMounted, onUnmounted } from 'vue';
import { getLastPosts, getPostsByUserId, handleDeletePost, listenForPost } from '../services/posts';
import { getUserProfileById } from '../services/user-profiles';
import { getFileUrl, deleteFile } from '../services/storage';

export default function usePosts() {
    const posts = ref([]);
    const loading = ref(false);
    const error = ref(null);
    let unsubListen = () => {};

    // Función para enriquecer un post con datos de perfil y multimedia
    const enrichPost = async (post) => {
        try {
            const userProfile = await getUserProfileById(post.sender_id);

            let avatarURL = null;
            if (userProfile?.avatar) {
                avatarURL = getFileUrl(userProfile.avatar, 'avatars');
            }

            let mediaUrl = null;
            if (post.multimedia) {
                mediaUrl = getFileUrl(`post/${post.multimedia}`, 'post-multimedia');
            }

            return {
                ...post,
                display_name: userProfile?.display_name || '',
                pronouns: userProfile?.pronouns || '',
                avatarURL,
                mediaUrl,
            };
        } catch (err) {
            console.error('Error enriching post:', err);
            return post; // Retornar post sin enriquecer si falla
        }
    };

    // Fetch posts generales (últimos posts)
    const fetchPosts = async () => {
        loading.value = true;
        error.value = null;
        try {
            const rawPosts = await getLastPosts();
            const enrichedPosts = await Promise.all(rawPosts.map(enrichPost));
            posts.value = enrichedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (err) {
            error.value = err.message || 'Error al cargar posts';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Fetch posts de un usuario específico
    const fetchUserPosts = async (userId) => {
        loading.value = true;
        error.value = null;
        try {
            const rawPosts = await getPostsByUserId(userId);
            const enrichedPosts = await Promise.all(rawPosts.map(enrichPost));
            posts.value = enrichedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (err) {
            error.value = err.message || 'Error al cargar posts del usuario';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Eliminar un post
    const deletePost = async (id) => {
        try {
            const postToDelete = posts.value.find(p => p.id === id);
            if (postToDelete?.multimedia) {
                await deleteFile(`post/${postToDelete.multimedia}`, 'post-multimedia');
            }
            await handleDeletePost(id);
            posts.value = posts.value.filter(p => p.id !== id);
        } catch (err) {
            error.value = err.message || 'Error al eliminar post';
            console.error(err);
        }
    };

    // Suscribirse a nuevos posts en tiempo real
    onMounted(async () => {
        unsubListen = await listenForPost(async (newPost) => {
            const enrichedNewPost = await enrichPost(newPost);
            posts.value.unshift(enrichedNewPost); // Agregar al inicio
        });
    });

    onUnmounted(() => {
        unsubListen();
    });

    return {
        posts,
        loading,
        error,
        fetchPosts,
        fetchUserPosts,
        deletePost,
    };
}
