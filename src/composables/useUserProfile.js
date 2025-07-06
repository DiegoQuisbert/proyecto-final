
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

    const loadingUser = ref(false);


    onMounted(async () => {
        try {
            loadingUser.value = true;
            user.value = await getUserProfileById(id);
            
            if (user.value.avatar) {
                user.value.avatarURL = getFileUrl(user.value.avatar, 'avatars');
            }
        } catch (error) {
            //TODO...
        }
        loadingUser.value = false;
    });

    return {
        user,
        loadingUser,
    }
}