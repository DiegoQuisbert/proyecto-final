<script setup>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { updateCurrentUserProfile } from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';
import { ref, onMounted } from 'vue';

const { user } = useAuthUserState();
const { profile, editing, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(user) {
    const profile = ref({
        bio: '',
        pronoums: '',
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
    <MainH1>Editar mi perfil</MainH1>

    <form 
        action="#" 
        @submit.prevent="handleSubmit"
    >

        <div class="mb-4">
            <MainLabel 
                for="bio" 
                class="block mb-2"
            >Biografía</MainLabel>
            <textarea 
                v-model="profile.bio" 
                id="bio" 
                class="w-full p-2 border borer-gray-400 rounded"
            ></textarea>
        </div>
        <div class="mb-4">
            <MainLabel 
                for="display_name" 
            >Nombre de usuario</MainLabel>
            <input 
                v-model="profile.display_name" 
                type="text" 
                id="display_name"
                class="w-full p-2 border borer-gray-400 rounded">
        </div>
        <div class="mb-4">
            <MainLabel 
                for="display_name" 
            >Pronombres</MainLabel>
            <input 
                v-model="profile.pronoums" 
                type="text" 
                id="pronoums"
                class="w-full p-2 border borer-gray-400 rounded">
        </div>
        <MainButton type="submit">
            <!-- <span :disabled="loading" v-if="loading"
                    class="animate-spin inline-block mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> -->
            Actualizar perfil
        </MainButton>

    </form>
</template>