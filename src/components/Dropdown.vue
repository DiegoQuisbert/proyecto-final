<script setup>
// Como aun no me termino de arregar con flowbite, tuve que hacer el dropdown de esta forma

import { ref } from 'vue';

const props = defineProps({
    post: { type: Object, required: true },
    currentUserId: { type: String, required: true },
});

const emit = defineEmits(['deletePost', 'editPost']);

const isOpen = ref(false);

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

// Por ahora sin validación, Se va a implementar un modal para confirmar
function handleDelete() {
    emit('deletePost', props.post.id);
    isOpen.value = false;
}
</script>

<template>
    <div class="relative ml-auto">
        <button @click="toggleDropdown"
            class="p-1 cursor-pointer rounded hover:bg-gray-100 transition focus:outline-none" aria-label="Opciones">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                class="w-6 h-6 text-gray-600">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
            </svg>
        </button>

        <div v-if="isOpen"
            class="absolute right-0 mt-2 w-44 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm">
            <ul class="py-2 text-sm">
                <template v-if="props.currentUserId === props.post.sender_id">
                    <li>
                        <button @click="handleDelete"
                            class="w-full cursor-pointer text-left block px-4 py-2 text-[#ff5757] hover:bg-[#DCDAED]">
                            Eliminar
                        </button>
                    </li>
                    <li>
                        <RouterLink :to="`/posts/${props.post.id}/editar`"
                            class="w-full cursor-pointer text-left block px-4 py-2 hover:bg-[#DCDAED] hover:text-[#7f7f7f]">
                            Editar
                        </RouterLink>
                    </li>
                </template>
                <li>
                    <RouterLink :to="`/mensajes/${props.post.sender_id}/chat`"
                        class="block cursor-pointer px-4 py-2 hover:bg-[#DCDAED] hover:text-[#7f7f7f]">
                        Mensajear
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
