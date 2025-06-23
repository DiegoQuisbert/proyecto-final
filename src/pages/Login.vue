<script setup>
import MainH1 from "../components/MainH1.vue";
import MainLabel from "../components/MainLabel.vue";
import MainButton from "../components/MainButton.vue";
import fondoForms from "../assets/images/fondoForms.png";
import { login } from "../services/auth";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { user, loading, errors, handleSubmit } = useLoginForm();

function useLoginForm() {
    const user = ref({ email: "", password: "" });
    const loading = ref(false);
    const errors = ref({ email: "", password: "" });
    const router = useRouter();

    async function handleSubmit() {
        errors.value = { email: "", password: "" };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!user.value.email.trim() || !emailRegex.test(user.value.email.trim())) {
            errors.value.email = "Por favor, ingresa un email válido.";
            isValid = false;
        }

        if (!user.value.password.trim() || user.value.password.length < 6) {
            errors.value.password = "La contraseña debe tener al menos 6 caracteres.";
            isValid = false;
        }

        if (!isValid) return;

        try {
            loading.value = true;

            await login(user.value.email, user.value.password);

            router.push("/posts");
        } catch (error) {
        } finally {
            loading.value = false;
        }
    }

    return {
        user,
        loading,
        errors,
        handleSubmit,
    };
}
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center">
        <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${fondoForms})` }"></div>

        <div class="relative max-w-lg w-full p-12 bg-[#2d3c7d] rounded-lg shadow-md">
            <MainH1 class="text-center text-yellow-400">Ingresar a mi cuenta</MainH1>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <MainLabel for="email" class="text-purple-200">Email</MainLabel>
                    <input v-model="user.email" type="email" id="email"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="ejemplo@correo.com" />
                    <p v-if="errors.email" class="text-red-400 text-sm mt-1">
                        {{ errors.email }}
                    </p>
                </div>

                <div>
                    <MainLabel for="password" class="text-purple-200">Contraseña</MainLabel>
                    <input v-model="user.password" type="password" id="password"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••" />
                    <p v-if="errors.password" class="text-red-400 text-sm mt-1">
                        {{ errors.password }}
                    </p>
                </div>

                <MainButton
                    class="text-[#2d3c7d] hover:text-white border border-yellow-400 bg-[#eaa944] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center w-full p-3"
                    type="submit">
                    Iniciar sesión
                </MainButton>

                <hr />

                <div class="text-center">
                    <p class="text-purple-200">
                        ¿No tenés una cuenta?
                        <RouterLink class="text-sm text-yellow-400 font-semibold hover:underline" to="/crear-cuenta">
                            Registrate
                        </RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>
