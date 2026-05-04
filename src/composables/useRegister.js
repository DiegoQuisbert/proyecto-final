import { ref } from "vue";
import { useRouter } from "vue-router";

import { register } from "../services/auth";

export default function useRegister(emit) {
    const router = useRouter();
    const user = ref({
        email: "",
        password: "",
        display_name: "",
    });
    const loading = ref(false);
    const feedback = ref({
        message: null,
        type: "success",
    });

    async function handleSubmit() {
        feedback.value.message = null;

        try {
            loading.value = true;

            await register(user.value.email, user.value.password, user.value.display_name);

            const newFeedback = {
                message: `¡Cuenta creada para ${user.value.email}!`,
                type: "success",
            };

            localStorage.setItem("feedback", JSON.stringify(newFeedback));
            emit("changeFeedback", newFeedback);

            setTimeout(() => {
                router.push("/posts");
            }, 1000);
        } catch (error) {
            feedback.value = {
                message: "No se pudo crear la cuenta. Verificá los datos.",
                type: "error",
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