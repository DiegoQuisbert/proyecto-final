
import { ref, toValue, watch } from "vue";
import { getUserProfileById } from "../services/user-profiles";
import { getFileUrl } from "../services/storage";

/**
 * @param {string} id
 */

export default function useUserProfile(id) {
    const user = ref({
        id: toValue(id),
        email: null,
        bio: null,
        display_name: null,
        pronouns: null,
        location: null,
        avatar: null,
        avatarURL: null,
    });

    const loadingUser = ref(false);
    const error = ref(null);
    let requestId = 0;

    watch(() => toValue(id), async profileId => {
        const currentRequestId = ++requestId;
        user.value = {
            id: profileId,
            email: null,
            bio: null,
            display_name: null,
            pronouns: null,
            location: null,
            avatar: null,
            avatarURL: null,
        };
        error.value = null;
        loadingUser.value = Boolean(profileId);

        if (!profileId) {
            error.value = 'No se encontró el perfil solicitado.';
            return;
        }

        try {
            const profile = await getUserProfileById(profileId);

            if (currentRequestId !== requestId) return;

            if (!profile) {
                error.value = 'No se encontró el perfil solicitado.';
                return;
            }

            user.value = {
                ...profile,
                avatarURL: profile.avatar ? getFileUrl(profile.avatar, 'avatars') : null,
            };
        } catch (requestError) {
            if (currentRequestId !== requestId) return;

            console.error('[useUserProfile] Error al cargar el perfil:', requestError);
            error.value = 'No se pudo cargar el perfil. Intentá nuevamente.';
        } finally {
            if (currentRequestId === requestId) {
                loadingUser.value = false;
            }
        }
    }, { immediate: true });

    return {
        user,
        loadingUser,
        error,
    }
}