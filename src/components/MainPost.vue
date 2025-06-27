<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['handleDeletePost']);

function handleDeletePost() {
    emit('handleDeletePost', props.post.id);
}
</script>

<template>
    <li class="border border-gray-300 rounded p-4 shadow bg-white relative">
        <div class="absolute top-2 right-2 group">
            <button class="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 8q.825 0 1.412-.587Q14 6.825 14 6t-.588-1.412Q12.825 4 12 4t-1.412.588Q10 5.175 10 6t.588 1.413Q11.175 8 12 8Zm0 4q.825 0 1.412-.587Q14 10.825 14 10t-.588-1.412Q12.825 8 12 8t-1.412.588Q10 9.175 10 10t.588 1.413Q11.175 12 12 12Zm0 4q.825 0 1.412-.587Q14 14.825 14 14t-.588-1.412Q12.825 12 12 12t-1.412.588Q10 13.175 10 14t.588 1.413Q11.175 16 12 16Z" />
                </svg>
            </button>
            <div
                class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity z-10">
                <button @click="handleDeletePost"
                    class="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                    Eliminar
                </button>
            </div>
        </div>

        <RouterLink :to="`/posts/${props.post.id}`">
            <div class="mb-2">
                <RouterLink :to="`/usuario/${props.post.sender_id}`" class="text-blue-700 hover:underline">
                    <b class="text-gray-700">{{ props.post.display_name }} ||</b> {{ props.post.email }}
                </RouterLink>
                <span class="text-gray-500 text-sm ml-2">{{ props.post.created_at }}</span>
            </div>
            <div>{{ props.post.body }}</div>
        </RouterLink>
    </li>
</template>