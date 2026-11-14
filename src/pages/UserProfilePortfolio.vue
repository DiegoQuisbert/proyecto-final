<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import usePortfolio from '../composables/usePortfolio';
import MainPortFolio from '../components/MainPortFolio.vue';
import MainLoader from '../components/MainLoader.vue';

const route = useRoute();
const { portfolios, loading, fetchPortfolios } = usePortfolio();

onMounted(() => {
    fetchPortfolios(route.params.id);
});
</script>

<template>
    <section>
        <MainLoader v-if="loading" />
        <ul v-else class="flex flex-col gap-4">
            <MainPortFolio v-for="portfolio in portfolios" :key="portfolio.id" :portfolio="portfolio" />
        </ul>
    </section>
</template>