<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import supabase from '../services/supabase';
import { getFileUrl } from '../services/storage';
import MainLabel from '../components/MainLabel.vue';

const search = ref('');
const resultados = ref([]);
const loading = ref(false);

watch(search, async (nuevoTexto) => {
    if (nuevoTexto.trim() === '') {
        resultados.value = [];
        return;
    }

    loading.value = true;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('id, display_name, email, avatar')
        .or(`display_name.ilike.%${nuevoTexto}%,email.ilike.%${nuevoTexto}%`)
        .limit(10);

    if (error) {
        console.error('Error al buscar usuarios:', error);
        resultados.value = [];
    } else {
        resultados.value = data.map(u => ({
            ...u,
            avatarURL: u.avatar ? getFileUrl(u.avatar) : null,
        }));
    }

    loading.value = false;
});
</script>

<template>
    <div class="p-4">
        <div class="flex justify-center">
            <MainLabel class="sr-only"> Buscar usuarios </MainLabel>
            <input v-model="search" type="text" placeholder="Buscar" name="search"
                class="w-78 h-15 px-3 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2d3c7d] focus:border-[#2d3c7d]/50 transition-all" />
        </div>

        <div v-if="loading" class="mt-2 text-sm text-gray-500">Buscando...</div>

        <ul v-else class="mt-4 space-y-2">
            <li v-for="usuario in resultados" :key="usuario.id"
                class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
                <RouterLink :to="`/usuario/${usuario.id}`" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img v-if="usuario.avatarURL" :src="usuario.avatarURL" alt="avatar"
                            class="w-full h-full object-cover" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" class="w-6 h-6">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold">{{ usuario.display_name }}</div>
                        <div class="text-sm text-gray-500">{{ usuario.email }}</div>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </div>
</template>