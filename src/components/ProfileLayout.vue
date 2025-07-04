<script setup>
import { RouterLink } from "vue-router";
import Layout from "../components/Layout.vue";
import useAuthUserState from "../composables/useAuthUserState";
import MainH1 from "./MainH1.vue";

const { user } = useAuthUserState();
</script>

<template>

    <Layout>
        <div class="flex items-center gap-2 m-3">
            <RouterLink to="/posts" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                aria-label="Volver a posts">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d" class="w-7 h-7 mr-1"
                    style="flex-shrink: 0;" aria-hidden="true">
                    <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                    <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                </svg>
            </RouterLink>

            <MainH1> {{ user.display_name }} </MainH1>
        </div>
        <div class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg mb-3">
            <div class="flex justify-end space-x-3 p-4">
                <RouterLink to="/mi-perfil/editar" class="text-sm text-blue-600 font-semibold hover:underline">
                    Editar
                </RouterLink>
            </div>

            <div class="flex flex-col items-center p-6">
                <div
                    class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg mb-3">
                    <img v-if="user.avatarURL" :src="user.avatarURL" alt="foto de perfil"
                        class="w-full h-full object-cover" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" class="w-12 h-12">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                    </svg>
                </div>

                <h5 class="mb-1 text-xl font-medium text-gray-900">
                    {{ user.display_name || 'Sin especificar' }}
                </h5>
                <div class="text-base text-gray-800">
                    {{ user.email }}
                </div>

                <div class="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50 w-full">
                    <p class="mb-3 text-gray-700 italic">
                        {{ user.bio || 'Acá va mi biografía...' }}
                    </p>
                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Pronombres</span>
                            <div class="text-base text-gray-800">
                                {{ user.pronouns }}
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