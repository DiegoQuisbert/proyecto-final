<script setup>
import { RouterLink } from 'vue-router';
import MainActions from './MainActions.vue';

defineProps({
    replies: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="p-4 border-gray-200 space-y-6">

        <ul class="space-y-4">
            <li v-for="reply in replies" :key="reply.id" class="border border-gray-300 rounded p-4 bg-white relative">

                <div class="flex items-center gap-3 mb-3">
                    <RouterLink :to="`/usuario/${reply.sender_id}`" class="flex items-center gap-3 flex-shrink-0">
                        <div
                            class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <img v-if="reply.avatarURL" :src="reply.avatarURL" alt="Avatar"
                                class="w-full h-full object-cover" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24"
                                class="w-7 h-7">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                            </svg>
                        </div>
                        <div class="flex gap-2 items-center hover:underline">
                            <span class="font-semibold text-gray-900 text-lg">{{ reply.display_name }}</span>
                            <span class="text-gray-500 text-sm truncate max-w-xs">{{ reply.email }}</span>
                        </div>
                    </RouterLink>
                    <span class="text-gray-500 text-sm">
                        {{ new Date(reply.created_at).toLocaleString() }}
                    </span>
                </div>

                <p class="text-gray-800 whitespace-pre-line leading-relaxed">{{ reply.body }}</p>

                <div v-if="reply.mediaUrl" class="rounded shadow mt-2">
                    <img :src="reply.mediaUrl" alt="Imagen de la respuesta"
                        class="max-w-full max-h-[30vh] object-contain rounded block" />
                </div>
            </li>
        </ul>
    </div>
</template>