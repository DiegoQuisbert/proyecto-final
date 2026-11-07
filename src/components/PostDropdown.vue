<script setup>
import { ref } from 'vue';
import { FwbDropdown } from 'flowbite-vue';

const props = defineProps({
    post: { type: Object, required: true },
    currentUserId: { type: String, required: true },
});

const emit = defineEmits(['deletePost']);
const isOpen = ref(false);

function handleDelete() {
    emit('deletePost', props.post.id);
}
</script>

<template>
    <!-- Se añadió !bg-white para forzar el fondo blanco en el contenedor de Flowbite -->
    <FwbDropdown
        align-to-end
        close-inside
        class="ml-auto"
        content-wrapper-class="w-44 divide-y divide-gray-100 rounded-lg border border-gray-200 !bg-white shadow-sm"
        @show="isOpen = true"
        @hide="isOpen = false"
    >
        <template #trigger>
            <button type="button"
                class="p-1 cursor-pointer rounded hover:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label="Opciones del post"
                aria-haspopup="true"
                :aria-expanded="isOpen"
                :aria-controls="`post-options-${props.post.id}`">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                class="w-6 h-6 text-gray-600">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
            </svg>
            </button>
        </template>

        <!-- Se cambió text-gray-50 por text-gray-700 para que las letras se lean correctamente -->
        <ul :id="`post-options-${props.post.id}`" class="py-2 text-sm text-gray-700">
            <template v-if="props.currentUserId === props.post.sender_id">
                <li>
                    <button type="button" @click="handleDelete"
                        class="w-full cursor-pointer text-left block px-4 py-2 text-[#ff5757] hover:bg-[#DCDAED]">
                        Eliminar
                    </button>
                </li>
                <li>
                    <RouterLink :to="`/posts/${props.post.id}/editar`"
                        class="w-full cursor-pointer text-left block px-4 py-2 hover:bg-[#DCDAED] hover:text-gray-900">
                        Editar
                    </RouterLink>
                </li>
            </template>
            <li v-else>
                <RouterLink :to="`/mensajes/${props.post.sender_id}/chat`"
                    class="block cursor-pointer px-4 py-2 hover:bg-[#DCDAED] hover:text-gray-900">
                    Mensajear
                </RouterLink>
            </li>
        </ul>
    </FwbDropdown>
</template>
