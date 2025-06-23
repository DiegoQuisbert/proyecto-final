<script setup>
import { RouterLink } from "vue-router";
import Layout from "../components/Layout.vue";
import useAuthUserState from "../composables/useAuthUserState";
import MainH1 from "./MainH1.vue";

const { user } = useAuthUserState();
</script>

<template>

    <Layout>
        <header>
            <MainH1 class="text-">
                <RouterLink to="/posts"
                        class="text-lg p-6 text-yellow-400 font-semibold">
                        <-
                </RouterLink>
                {{ user.display_name }}
            </MainH1>
        </header>
        <div class="max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex justify-end space-x-3 p-4">
                <RouterLink to="/mi-perfil/editar" class="text-sm text-blue-600 font-semibold hover:underline">
                    Editar
                </RouterLink>
            </div>

            <div class="flex flex-col items-center p-6">
                <img v-if="user.avatar" :src="user.avatarURL" alt="foto de perfil"
                    class="w-24 h-24 rounded-full shadow-lg" />

                <span class="text-sm font-semibold text-gray-500 mt-4">Nombre de usuario</span>
                <h5 class="mb-1 text-xl font-medium text-gray-900">
                    {{ user.display_name || 'Sin especificar' }}
                </h5>
                <div class="text-base text-gray-800">
                    {{ user.email }}
                </div>

                <div class="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <p class="mb-3 text-gray-700 italic">
                        {{ user.bio || 'Acá va mi biografía...' }}
                    </p>
                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Pronombres</span>
                            <div class="text-base text-gray-800">
                                {{ user.pronoums }}
                            </div>
                        </div>
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Ubicación</span>
                            <div class="text-base text-gray-800">
                                {{ user.location }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <slot />
    </Layout>
</template>