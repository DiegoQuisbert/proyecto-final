<script setup>
import { ref, onMounted } from 'vue';

import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import MainLoader from '../components/MainLoader.vue';
import AlertBox from '../components/AlertBox.vue';

import { updateCurrentUserProfile } from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';
import Layout from '../components/Layout.vue';

const { user } = useAuthUserState();
const { profile, editing, feedback, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(user) {
    const profile = ref({
        bio: '',
        pronouns: '',
        location: '',
        display_name: '',
    });
    const editing = ref(false);
    const feedback = ref({
        message: null,
        type: 'success',
    });

    async function handleSubmit() {
        feedback.value.message = null;

        try {
            editing.value = true;
            await updateCurrentUserProfile({
                ...profile.value,
            });

            feedback.value = {
                message: 'La información de perfil se actualizó con éxito',
                type: 'success',
            }
        } catch (error) {
            feedback.value = {
                message: 'Ocurrió un error inesperado al tratar de actualizar la información de perfil',
                type: 'error',
            }
        }
        editing.value = false;
    }

    onMounted(() => {
        profile.value = {
            bio: user.value.bio,
            display_name: user.value.display_name,
            pronouns: user.value.pronouns,
            bio: user.value.bio,
            location: user.value.location
        }
    })

    return {
        profile,
        editing,
        feedback,
        handleSubmit,
    }
}
</script>

<template>

    <Layout>
        <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <MainH1>Editar mi perfil</MainH1>

            <AlertBox v-if="feedback.message != null" :content="feedback" />

            <div>
                <RouterLink to="/mi-perfil" class="text-sm text-blue-600 font-semibold hover:underline">
                    <- volver </RouterLink>
            </div>
            <form action="#" @submit.prevent="handleSubmit" class="space-y-5 mt-4">
                <div>
                    <MainLabel for="display_name" class="block text-gray-700 font-semibold">Nombre de usuario
                    </MainLabel>
                    <input v-model="profile.display_name" id="display_name" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <MainLabel for="bio" class="block text-gray-700 font-semibold">Biografía</MainLabel>
                    <textarea v-model="profile.bio" id="bio"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>


                <div>
                    <MainLabel for="pronouns" class="block text-gray-700 font-semibold">Pronombres</MainLabel>
                    <input v-model="profile.pronouns" id="pronouns" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <MainLabel for="location" class="block text-gray-700 font-semibold">Ubicación</MainLabel>
                    <input v-model="profile.location" id="location" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <RouterLink to="/mi-perfil/editar/avatar"
                        class="text-sm text-blue-600 font-semibold hover:underline">
                        Editar imagen
                    </RouterLink>
                </div>

                <MainButton type="submit" class="w-full py-3">
                    <template v-if="!editing">
                        Actualizar mi perfil
                    </template>
                    <MainLoader v-else />
                </MainButton>
            </form>
        </div>

    </Layout>

</template>
