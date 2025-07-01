<script setup>
import MainH1 from "../components/MainH1.vue";
import MainLabel from "../components/MainLabel.vue";
import fondoForms from "../assets/images/fondoForms.png";
import { register } from "../services/auth";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { user, loading, handleSubmit } = useRegisterForm();

function useRegisterForm() {
    const user = ref({
        email: "",
        password: "",
        display_name: "",
    });
    const loading = ref(false);
    const router = useRouter();

    async function handleSubmit() {
        try {
            loading.value = true;

            await register(user.value.email, user.value.password, user.value.display_name);
            router.push("/posts");
        } catch (error) {
        }
    }

    return {
        user,
        loading,
        handleSubmit,
    };
}
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center">
        <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${fondoForms})` }"></div>

        <div class="relative max-w-md w-full p-12 bg-[#2d3c7d] rounded-lg shadow-md">
            <MainH1 class="text-center text-yellow-400">Crear una cuenta</MainH1>
            <RouterLink to="/"
                        class="text-sm text-yellow-400 font-semibold hover:underline">
                        <- volver
                    </RouterLink>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <MainLabel class="text-purple-200" for="display_name">Nombre</MainLabel>
                    <input v-model="user.display_name" type="text" id="display_name"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="ejemplo123" />
                </div>

                <div>
                    <MainLabel class="text-purple-200" for="email">Email</MainLabel>
                    <input v-model="user.email" type="email" id="email"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="ejemplo@correo.com" />
                </div>

                <div>
                    <MainLabel class="text-purple-200" for="password">Contraseña</MainLabel>
                    <input v-model="user.password" type="password" id="password"
                        class="w-full px-4 py-2 border bg-[#dcdaed] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••" />
                </div>

                <button
                    class="text-[#2d3c7d] cursor-pointer hover:text-white border border-yellow-400 bg-[#eaa944] hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center w-full p-3"
                    type="submit">
                    Registrarse
                </button>

                <hr />

                <div class="text-center">
                    <p class="text-purple-200">
                        ¿Ya tenés una cuenta?
                        <RouterLink class="text-sm text-yellow-400 font-semibold hover:underline" to="/iniciar-sesion">
                            Iniciá sesión
                        </RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>
