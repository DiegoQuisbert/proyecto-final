<script setup>
import { computed } from 'vue';


const props = defineProps({
    buttonStyle: {
        type: String,
        default: 'primary',
    }
});

const buttonColor = computed(() => {
    switch (props.buttonStyle) {
        case 'secondary':
            return "bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700";
        case 'danger':
            return "bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700";
        case 'success':
            return "bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700";
        default:
            return "bg-[#2d3c7d] hover:bg-[#2d3c7d]/90 focus:bg-[#2d3c7d]/90 active:bg-[#2d3c7d]/70";
    }
});

</script>

<template>
    <button :class="`w-50 rounded-3xl transition-color py-2 px-4 ${buttonColor} text-white cursor-pointer`">
        <slot />
    </button>

</template>