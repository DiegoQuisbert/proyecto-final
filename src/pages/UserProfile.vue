<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';

const route = useRoute();
const { user, loadingUser } = useUserProfile(route.params.id);
</script>

<template>
    <div v-if="!loadingUser" class="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-xl space-y-6">
        <div class="flex justify-between items-center">
            <MainH1>Perfil de {{ user.display_name || user.email }}</MainH1>
            <RouterLink :to="`/usuario/${user.id}/chat`"
                class="py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition">MD</RouterLink>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 italic min-h-[80px]">
            {{ user.bio || 'Acá va mi biografía...' }}
        </div>
        <dl class="space-y-4 text-gray-800">
            <div>
                <dt class="text-sm font-semibold text-gray-500">Email</dt>
                <dd class="text-base">{{ user.email }}</dd>
            </div>
            <div>
                <dt class="text-sm font-semibold text-gray-500">Nombre de usuario</dt>
                <dd class="text-base">{{ user.display_name || 'Sin especificar' }}</dd>
            </div>
            <div>
                <dt class="text-sm font-semibold text-gray-500">Pronombres</dt>
                <dd class="text-base">{{ user.pronoums || 'Sin especificar' }}</dd>
            </div>
        </dl>
    </div>
    <MainLoader v-else />
</template>