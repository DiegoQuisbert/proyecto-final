<script setup>
import { onUnmounted, ref } from 'vue';
import { useRouter } from "vue-router";

import Layout from '../components/Layout.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainLoader from '../components/MainLoader.vue';

import { updateCurrentUserAvatar } from '../services/auth';

const { avatar, editing, handleFileChange, handleSubmit } = useProfileEditAvatarForm();

function useProfileEditAvatarForm() {
    const router = useRouter();
    const avatar = ref({
        file: null,
        preview: null,
    });
    const editing = ref(false);

    async function handleSubmit() {
        try {
            editing.value = true;
            await updateCurrentUserAvatar(avatar.value.file);
            router.push("/mi-perfil");
        } catch (error) {
            console.error('Error al actualizar avatar:', error);
        }
        editing.value = false;
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            if (avatar.value.preview) URL.revokeObjectURL(avatar.value.preview);
            avatar.value = { file: null, preview: null };
            return;
        }
        avatar.value.file = selectedFile;
        avatar.value.preview = URL.createObjectURL(selectedFile);
    }

    onUnmounted(() => {
        if (avatar.value.preview) URL.revokeObjectURL(avatar.value.preview);
    });

    return { avatar, editing, handleFileChange, handleSubmit };
}
</script>

<template>
    <Layout>
        <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <MainH1>Editar mi imagen de perfil</MainH1>

            <RouterLink to="/mi-perfil/editar"
                class="text-sm text-blue-600 font-semibold hover:underline block mt-2 mb-4">
                ← Volver
            </RouterLink>

            <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-6 mt-6">

                <div class="w-full max-w-xs">
                    <MainLabel for="avatar" class="text-center">Seleccionar nueva imagen</MainLabel>
                    <div class="flex items-center justify-center w-full mt-2">
                        <label for="avatar"
                            class="w-32 h-32 rounded-full border-2 border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 shadow flex items-center justify-center transition">
                            <div class="text-center">
                                <svg class="w-6 h-6 mx-auto text-gray-500 mb-1" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p class="text-xs text-gray-500 text-center">Subir imagen</p>
                            </div>

                            <input id="avatar" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                        </label>
                    </div>
                </div>
                <div class="flex flex-col items-center space-y-2">
                    <h2 class="text-sm text-gray-600">Vista previa</h2>
                    <div class="w-32 h-32 rounded-full overflow-hidden border border-gray-300 shadow">
                        <img v-if="avatar.preview" :src="avatar.preview" alt="Previsualización"
                            class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                            No seleccionada
                        </div>
                    </div>
                </div>

                <MainButton class="w-full max-w-xs">
                    <template v-if="editing">
                        <MainLoader />
                    </template>
                    <template v-else>
                        Actualizar foto de perfil
                    </template>
                </MainButton>
            </form>
        </div>
    </Layout>
</template>
