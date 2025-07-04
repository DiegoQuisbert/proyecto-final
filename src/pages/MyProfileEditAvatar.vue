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

        }
        editing.value = false;
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            if (avatar.value.preview) URL.revokeObjectURL(avatar.value.preview);

            avatar.value = {
                file: null,
                preview: null,
            }
            return;
        }

        avatar.value.file = selectedFile;

        avatar.value.preview = URL.createObjectURL(avatar.value.file);
    }

    onUnmounted(() => (avatar.value.preview) ? URL.revokeObjectURL(avatar.value.preview) : null)

    return ({
        avatar,
        editing,
        handleFileChange,
        handleSubmit,
    })
}

</script>
<template>

    <Layout>
        <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <MainH1>Editar mi imagen de perfil</MainH1>
            <div>
                <RouterLink to="/mi-perfil/editar" class="text-sm text-blue-600 font-semibold hover:underline">
                    <- volver </RouterLink>
            </div>
            <form action="#" class="flex flex-col md:flex-row mt-4" @submit.prevent="handleSubmit">
                <div class="md:w-1/2">
                    <div class="mb-4">
                        <MainLabel for="avatar" class="mb-3">Editar imágen</MainLabel>
                        <input
                            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 light:text-gray-400 focus:outline-none light:border-gray-600 light:placeholder-gray-400"
                            id="avatar" type="file" @change="handleFileChange">

                    </div>
                    <MainButton>
                        <template v-if="editing">
                            <MainLoader />
                        </template>
                        <template v-else>
                            Actualizar mi foto de perfil
                        </template>
                    </MainButton>
                </div>

                <div class="md:w-1/2 flex flex-col items-center justify-center">
                    <h2 class="sr-only">Previsualización de la imagen seleccionada</h2>
                    <img v-if="avatar.preview" :src="avatar.preview" alt="Previsualización de la imagen"
                        class="w-32 h-32 rounded-full object-cover border border-gray-300" />
                </div>
            </form>
        </div>
    </Layout>

</template>
