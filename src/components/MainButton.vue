<script setup>
import { computed } from 'vue';

// Se contempla cambiar los colores de secondary, danger y success y utilizarlo más adelante

const props = defineProps({
    buttonStyle: {
        type: String,
        default: 'primary',
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});

const buttonColor = computed(() => {
    if (props.disabled) return "bg-gray-400 cursor-not-allowed";
    switch (props.buttonStyle) {
        case 'secondary':
            return "bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700";
        case 'danger':
            return "bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700";
        case 'success':
            return "bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700";
        default:
            return "bg-blue hover:bg-blue/90 focus:bg-blue/90 active:bg-blue/70";
    }
});

</script>

<template>
    <button :disabled="disabled" :class="`w-50 rounded-3xl transition-color py-2 px-4 ${buttonColor} text-white cursor-pointer`">
        <slot />
    </button>

</template>