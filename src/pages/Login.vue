<script setup>

import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import MainH1 from "../components/MainH1.vue";
import MainLabel from "../components/MainLabel.vue";
import MainLoader from "../components/MainLoader.vue";
import AlertBox from "../components/AlertBox.vue";

import fondoForms from "../assets/images/fondoForms.png";

import { login } from "../services/auth";

const router = useRouter();
const emit = defineEmits();

const { user, loading, feedback, handleSubmit } = useLoginForm(router);

function useLoginForm(router) {
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
</script>


<template>
    <div class="relative min-h-screen flex items-center justify-center">
        <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${fondoForms})` }"></div>

        <div class="relative max-w-lg w-full p-12 bg-[#2d3c7d] rounded-lg shadow-md">
            <MainH1 class="text-center text-yellow-400">Ingresar a mi cuenta</MainH1>

            <AlertBox v-if="feedback.message" :content="feedback" />

            <RouterLink to="/" class="text-sm text-yellow-400 font-semibold hover:underline">
                ← volver
            </RouterLink>

            <form @submit.prevent="handleSubmit" class="space-y-6 mt-4">
                <div>
                    <MainLabel for="email" class="text-purple-200">Email</MainLabel>
                    <input v-model="user.email" type="email" id="email"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="ejemplo@correo.com"/>
                </div>

                <div>
                    <MainLabel for="password" class="text-purple-200">Contraseña</MainLabel>
                    <input v-model="user.password" type="password" id="password"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••"/>
                </div>

                <button
                    class="text-[#2d3c7d] cursor-pointer hover:text-white border border-yellow-400 bg-[#eaa944] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center w-full p-3"
                    type="submit">
                    <template v-if="!loading">Iniciar sesión</template>
                    <MainLoader v-else />
                </button>

                <hr />

                <div class="text-center">
                    <p class="text-purple-200">
                        ¿No tenés una cuenta?
                        <RouterLink to="/crear-cuenta" class="text-sm text-yellow-400 font-semibold hover:underline">
                            Registrate
                        </RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>
