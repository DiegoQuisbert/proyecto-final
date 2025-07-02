<script setup>
import { RouterLink } from 'vue-router';

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
</script>

<template>
    <div class="flex gap-32">
        <RouterLink :to="`/posts/${props.post.id}`">
            <button
                class="p-2 rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center"
                aria-label="Ver comentarios">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z"
                        stroke="#2d3c7d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </RouterLink>

        <button
            class="p-2 rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center"
            aria-label="Repostear">
            <svg fill="#000000" viewBox="0 0 24 24" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M6,14V9A6,6,0,0,1,16.89,5.54"
                    style="fill: none; stroke: #2d3c7d; stroke-linecap: round; stroke-linejoin: round; stroke-width:1.2;" />
                <path d="M18,10v5A6,6,0,0,1,7.11,18.46"
                    style="fill: none; stroke: #2d3c7d; stroke-linecap: round; stroke-linejoin: round; stroke-width:1.2;" />
                <polyline points="8 12 6 14 4 12"
                    style="fill: none; stroke: #2d3c7d; stroke-linecap: round; stroke-linejoin: round; stroke-width:1.2;" />
                <polyline points="16 12 18 10 20 12"
                    style="fill: none; stroke: #2d3c7d; stroke-linecap: round; stroke-linejoin: round; stroke-width:1.2;" />
            </svg>
        </button>

        <button
            class="p-2 rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center"
            aria-label="Me gusta">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                <path
                    d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                    stroke="#2d3c7d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    </div>
</template>