<script setup>
import { RouterLink } from 'vue-router';
import Dropdown from './Dropdown.vue';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    currentUserId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['handleDeletePost']);

function handleDeletePost(id) {
    emit('handleDeletePost', id);
}
</script>

<template>
    <li class="border border-gray-300 rounded p-4 shadow bg-white relative">
        <div class="flex items-center gap-3 mb-3">
            <RouterLink :to="`/usuario/${props.post.sender_id}`" class="flex items-center gap-3 flex-shrink-0">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img v-if="props.post.avatarURL" :src="props.post.avatarURL" alt="Avatar"
                        class="w-full h-full object-cover" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" class="w-8 h-8">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
                    </svg>
                </div>

                <div class="flex gap-2 items-center">
                    <span class="font-semibold hover:underline text-gray-900 text-lg">{{ props.post.display_name
                        }}</span>
                    <span class="text-gray-500 text-sm truncate max-w-xs">{{ props.post.email }}</span>
                    <span>{{ new Date(props.post.created_at).toLocaleString() }}</span>
                </div>
            </RouterLink>

            <Dropdown :post="props.post" :currentUserId="props.currentUserId" @deletePost="handleDeletePost" />
        </div>

        <RouterLink :to="`/posts/${props.post.id}`" class="block">
            <p class="text-gray-800 mb-3">{{ props.post.body }}</p>
            <div v-if="props.post.mediaUrl" class="rounded-[1vw] overflow-hidden shadow mb-3 max-h-80">
                <img :src="props.post.mediaUrl" alt="Media" class="w-full h-80 object-cover object-center" />
            </div>
        </RouterLink>
    </li>
</template>
