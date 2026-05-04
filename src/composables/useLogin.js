import { ref } from "vue";
import { useRouter } from "vue-router";

import { login } from "../services/auth";

export default function useLogin(emit) {
    const router = useRouter();
    const user = ref({ email: "", password: "" });
    const loading = ref(false);
    const feedback = ref({
        message: null,
        type: 'success',
    });

    async function handleSubmit() {
        feedback.value.message = null;

        try {
            loading.value = true;

            await login(user.value.email, user.value.password);

            const newFeedback = {
                message: `¡Hola de nuevo, ${user.value.email}!`,
                type: 'success',
            };

            localStorage.setItem("feedback", JSON.stringify(newFeedback));

            emit('changeFeedback', newFeedback);
            router.push("/posts");

        } catch (error) {
            feedback.value = {
                message: 'Las credenciales ingresadas no coinciden.',
                type: 'error',
            };
        } finally {
            loading.value = false;
        }
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    };
}