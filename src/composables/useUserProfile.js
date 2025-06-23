
import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";

/**
 * @param {string} id
 */

export default function useUserProfile(id) {
        const user = ref({
        id,
        email: null,
        bio: null,
        display_name: null,
        pronoums: null,
        location: null,
        avatar: null,
    });

    const loadingUser = ref(false);


    onMounted(async () => {
        try {
            loadingUser.value = true;
            user.value = await getUserProfileById(id);
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