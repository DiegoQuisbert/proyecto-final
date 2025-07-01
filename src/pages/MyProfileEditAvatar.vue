<script setup>
import { onUnmounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { updateCurrentUserAvatar } from '../services/auth';
import Layout from '../components/Layout.vue';
import { RouterLink, useRouter } from "vue-router";

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
        console.log(event.target.file);

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
                    <RouterLink to="/mi-perfil/editar"
                        class="text-sm text-blue-600 font-semibold hover:underline">
                        <- volver
                    </RouterLink>
                </div>
            <form action="#" class="flex flex-col md:flex-row gap-6 mt-4" @submit.prevent="handleSubmit">
                <div class="md:w-1/2">
                    <div class="mb-4">
                        <MainLabel for="avatar" class="block text-gray-700 font-semibold">Nueva imagen</MainLabel>
                        <input id="avatar" type="file"
                            class="w-full p-3 cursor-pointer border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @change="handleFileChange" />
                    </div>
                    <MainButton>
                        <template v-if="!editing">

                        </template>
                        Actualizar mi imagen de perfil
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
