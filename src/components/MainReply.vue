<script setup>
//Eventualmente se incluirá el mismo dropdown que tiene MainPost.vue
//Ya que las funciones de editar y borrar ya fueron creadas, pero se encuentran sin usar por ahora
//Igualmente también se incluirán los botones que lleva MainPost.vue

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
                            class="w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
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
                            <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-white border border-gray-500">{{reply.pronouns}}</span>
                        </div>
                    </RouterLink>
                    <span class="text-gray-500 text-sm">
                        {{ new Date(reply.created_at).toLocaleString() }}
                    </span>
                </div>

                <p class="text-gray-800 whitespace-pre-line leading-relaxed">{{ reply.body }}</p>

                <div v-if="reply.mediaUrl" class="mt-2 flex">
                    <img :src="reply.mediaUrl" alt="Imagen de la respuesta" class="h-85 rounded"/>
                </div>
            </li>
        </ul>
    </div>
</template>