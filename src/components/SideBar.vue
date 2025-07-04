<script setup>
import supabase from '../services/supabase';

import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

import MainLabel from '../components/MainLabel.vue';

import { getFileUrl } from '../services/storage';

const search = ref('');
const results = ref([]);
const loading = ref(false);

watch(search, async (search) => {
    if (search.trim() === '') {
        results.value = [];
        return;
    }

    loading.value = true;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('id, display_name, email, avatar')
        .or(`display_name.ilike.%${search}%,email.ilike.%${search}%`)
        .limit(10);

    if (error) {
        console.error('Error al buscar users:', error);
        results.value = [];
    } else {
        results.value = data.map(u => ({
            ...u,
            avatarURL: u.avatar ? getFileUrl(u.avatar) : null,
        }));
    }

    loading.value = false;
});
</script>

<template>
    <div>
        <div class="flex justify-center">
            <MainLabel>
                <input v-model="search" type="text" placeholder="Buscar" name="search"
                    class="w-78 h-15 px-3 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2d3c7d] focus:border-[#2d3c7d]/50 transition-all" aria-label="search" />
            </MainLabel>
        </div>

        <div v-if="loading" class="mt-2 text-sm text-gray-500">Buscando...</div>

        <ul v-else class="mt-4 space-y-2">
            <li v-for="user in results" :key="user.id"
                class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
                <RouterLink :to="`/usuario/${user.id}`" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img v-if="user.avatarURL" :src="user.avatarURL" alt="avatar"
                            class="w-full h-full object-cover" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" class="w-6 h-6">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold">{{ user.display_name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </div>
</template>