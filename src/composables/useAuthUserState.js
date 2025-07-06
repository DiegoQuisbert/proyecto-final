import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthUserChanges } from "../services/auth";
import { getFileUrl } from "../services/storage";

export default function useAuthUserState() {
    let unsubAuth = () => {}
    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        pronouns: null,
        location: null,
        avatar: null,
        avatarURL: null,
    });

    onMounted(() => unsubAuth = subscribeToAuthUserChanges(newUserData => {
        user.value = newUserData;
        user.value.avatarURL = user.value.avatar ? getFileUrl(user.value.avatar, 'avatars') : null;
    }));

    onUnmounted(() => unsubAuth());

    return {
        user,
    }
}