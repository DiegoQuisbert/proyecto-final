<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useAuthUserState from '../composables/useAuthUserState';
import usePortfolio from '../composables/usePortfolio';
import useGlobalFeedback from '../composables/useGlobalFeedback';

import ProfileLayout from '../components/ProfileLayout.vue';
import ProfileNav from '../components/ProfileNav.vue';
import MainLoader from '../components/MainLoader.vue';
import MainPortFolio from '../components/MainPortFolio.vue';
import AlertBox from '../components/AlertBox.vue';

import { uploadFile, getFileUrl } from '../services/storage';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';

const { user } = useAuthUserState();
const { portfolios, loading, fetchPortfolios, submitPortfolio, deletePortfolio } = usePortfolio();
const { feedback } = useGlobalFeedback();

const portfolioForm = ref({
    title: '',
    body: '',
    file: null,
    preview: null
});

function handleFileChange(event) {
    const selected = event.target.files[0];
    if (!selected) {
        if (portfolioForm.value.preview) URL.revokeObjectURL(portfolioForm.value.preview);
        portfolioForm.value = { title: '', body: '', file: null, preview: null };
        return;
    }

    portfolioForm.value.file = selected;
    portfolioForm.value.preview = URL.createObjectURL(selected);
}

onUnmounted(() => {
    if (portfolioForm.value.preview) URL.revokeObjectURL(portfolioForm.value.preview);
});

async function handleSubmitPortfolio() {
    await submitPortfolio(user.value.id, portfolioForm.value);
    portfolioForm.value = { title: '', body: '', file: null, preview: null };
}

onMounted(() => fetchPortfolios(user.value.id));
</script>

<template>
    <ProfileLayout>
        <ProfileNav />
        <AlertBox v-if="feedback.message" :content="feedback" />
        <section class="max-w-4xl mx-auto space-y-6">
            <div class="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-4 border border-gray-200">
                <div class="md:w-1/2 w-full">
                    <label for="portfolio-image"
                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click para subir</span></p>
                            <p class="text-xs text-gray-500">SVG, PNG, JPG</p>
                        </div>
                        <input id="portfolio-image" type="file" class="hidden" @change="handleFileChange" />
                    </label>
                    <div v-if="portfolioForm.preview" class="mt-2">
                        <img :src="portfolioForm.preview" alt="Vista previa"
                            class="rounded border mt-2 max-h-60 object-contain mx-auto" />
                    </div>
                </div>

                <div class="md:w-1/2 w-full flex flex-col gap-4">
                    <MainLabel for="title">
                        <input id="title" type="text" v-model="portfolioForm.title" placeholder="Título del portfolio"
                            class="p-2 border rounded border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </MainLabel>
                    <textarea id="details" v-model="portfolioForm.body" rows="5" placeholder="Descripción"
                        class="p-2 border rounded border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 resize-y"></textarea>
                    <MainButton @click="handleSubmitPortfolio">
                        Subir portfolio
                    </MainButton>
                </div>
            </div>
        </section>
        <hr class="w-full h-1 mx-auto my-4 bg-[#DCDAED] border-0 rounded-sm">
        <section class="max-w-4xl mx-auto space-y-6">
            <MainLoader v-if="loading" />
            <ul v-else class="flex flex-col gap-4">
                <MainPortFolio v-for="portfolio in portfolios" :key="portfolio.id" :portfolio="portfolio"
                    :currenUserId="user.id" @handleDeletePortfolio="deletePortfolio" />
            </ul>
        </section>
    </ProfileLayout>
</template>