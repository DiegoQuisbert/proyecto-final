<script setup>
import Layout from '../components/Layout.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { RouterLink, useRoute } from 'vue-router';
import useUserProfile from '../composables/useUserProfile';

const route = useRoute();
const { user, loadingUser } = useUserProfile(route.params.id);
</script>

<template>
    <Layout>
        <MainLoader v-if="loadingUser" />

        <div v-else class="max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex justify-between items-center p-4">
                <MainH1>
                    Perfil de {{ user.display_name || user.email }}
                </MainH1>
                <RouterLink :to="`/mensajes/${user.id}/chat`"
                    class="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    MD
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

                <div class="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50 w-full">
                    <p class="mb-3 text-gray-700 italic">
                        {{ user.bio || 'Acá va mi biografía...' }}
                    </p>
                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Pronombres</span>
                            <div class="text-base text-gray-800">
                                {{ user.pronouns || 'Sin especificar' }}
                            </div>
                        </div>
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Ubicación</span>
                            <div class="text-base text-gray-800">
                                {{ user.location || 'Sin especificar' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <slot />
        </div>
    </Layout>
</template>