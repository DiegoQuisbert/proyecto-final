
import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";
import { getFileUrl } from "../services/storage";

/**
 * @param {string} id
 */

export default function useUserProfile(id) {
        const user = ref({
        id,
        email: null,
        bio: null,
        display_name: null,
        pronouns: null,
        location: null,
        avatar: null,
        avatarURL: null,
    });

    const loadingUser = ref(true);
    const error = ref(null);


    onMounted(async () => {
        error.value = null;
        try {
            const profile = await getUserProfileById(id);

            if (!profile) {
                error.value = 'No se encontró el perfil solicitado.';
                return;
            }

            user.value = profile;
            
            if (user.value.avatar) {
                user.value.avatarURL = getFileUrl(user.value.avatar, 'avatars');
            }
        } catch (requestError) {
            console.error('[useUserProfile] Error al cargar el perfil:', requestError);
            error.value = 'No se pudo cargar el perfil. Intentá nuevamente.';
        } finally {
            loadingUser.value = false;
        }
    });

    return {
        user,
        loadingUser,
        error,
    }
}