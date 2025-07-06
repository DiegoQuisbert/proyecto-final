<script setup>
const props = defineProps({
    portfolio: Object,
    currenUserId: String
});

const emit = defineEmits(['handleDeletePortfolio']);

import PortfolioDropdown from './PortfolioDropdown.vue';
</script>

<template>
    <div class="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-4 border border-gray-200">
        <div class="md:w-1/2 w-full">
            <img :src="portfolio.mediaUrl" alt="Media del portfolio"
                class="rounded border max-h-60 object-contain mx-auto" />
        </div>
        <div class="md:w-1/2 w-full flex flex-col gap-4">
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold">{{ portfolio.title }}</h3>
                <PortfolioDropdown :portfolio="portfolio" :currentUserId="currenUserId"
                    @deletePortfolio="emit('handleDeletePortfolio', $event)" />
            </div>
            <p class="text-gray-700">{{ portfolio.body }}</p>
        </div>
    </div>
</template>
