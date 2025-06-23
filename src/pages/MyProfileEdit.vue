<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { updateCurrentUserProfile } from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';
import { ref, onMounted } from 'vue';
import Layout from '../components/Layout.vue';

const { user } = useAuthUserState();
const { profile, editing, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(user) {
    const profile = ref({
        bio: '',
        pronoums: '',
        location: '',
        display_name: '',
    });
    const editing = ref(false);

    async function handleSubmit() {
        try {
            editing.value = true;
            await updateCurrentUserProfile({
                ...profile.value,
            });
        } catch (error) {
            //TODO...
        }
        editing.value = false;
    }

    onMounted(() => {
        profile.value = {
            bio: user.value.bio,
            display_name: user.value.display_name,
            pronoums: user.value.pronoums,
            bio: user.value.bio,
            location: user.value.location
        }
    })

    return {
        profile,
        editing,
        handleSubmit,
    }
}

// let unsubAuth = () => {}

// export default {
//     name: 'MyProfileEdit',
//     components: { MainH1, MainLabel, MainButton },
//     data() {
//         return {
//             profile: {
//                 bio: '',
//                 display_name: '',
//                 pronoums: '',
//             },
//             editing: false,
//         }
//     },
//     methods: {
//         async handleSubmit() {
//             try {
//                 this.editing = true;
//                 await updateCurrentUserProfile({ ...this.profile });
//             } catch (error) {
//                 //TODO...
//             }
//             this.editing = false;
//         },
//     },
//     mounted() {
//         unsubAuth = subscribeToAuthUserChanges(newUserState => {
//             this.profile = {
//                 bio: newUserState.bio,
//                 display_name: newUserState.display_name,
//                 pronoums: newUserState.pronoums,
//             }
//         });
//     },
//     unmounted() {
//         unsubAuth();
//     }
// }
</script>

<template>

    <Layout>
        <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <MainH1>Editar mi perfil</MainH1>

            <form action="#" @submit.prevent="handleSubmit" class="space-y-5 mt-4">
                <div>
                    <MainLabel for="bio" class="block text-gray-700 font-semibold">Biografía</MainLabel>
                    <textarea v-model="profile.bio" id="bio"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <MainLabel for="display_name" class="block text-gray-700 font-semibold">Nombre de usuario
                    </MainLabel>
                    <input v-model="profile.display_name" id="display_name" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <MainLabel for="pronoums" class="block text-gray-700 font-semibold">Pronombres</MainLabel>
                    <input v-model="profile.pronoums" id="pronoums" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <MainLabel for="location" class="block text-gray-700 font-semibold">Ubicación</MainLabel>
                    <input v-model="profile.location" id="location" type="text"
                        class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div class="text-right">
                    <RouterLink to="/mi-perfil/editar/avatar"
                        class="text-sm text-blue-600 font-semibold hover:underline">
                        Editar imagen
                    </RouterLink>
                </div>

                <MainButton type="submit" class="w-full py-3">
                    Actualizar perfil
                </MainButton>
            </form>
        </div>
    </Layout>

</template>
