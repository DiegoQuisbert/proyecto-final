<script setup>
defineProps({
    content: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div id="alert-3" class="flex items-center p-4 m-3 rounded-lg light:text-green-400" :class="{
        'bg-green-200': content.type == 'success',
        'bg-red-200': content.type == 'error',
        'bg-white': content.type == 'normal',
    }" role="alert">
        <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div class="ms-3 text-sm font-medium">
            {{ content.message }}
        </div>
    </div>
</template>