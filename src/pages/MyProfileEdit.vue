<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuthUserChanges, updateCurrentUserProfile } from '../services/auth';

export default {
    name: 'MyProfileEdit',
    components: { MainH1, MainLabel, MainButton},
    data() {
        return {
            profile: {
                bio: '',
                display_name: '',
            },
            editing: false,
        }
    },
    methods: {
        async handleSubmit() {
            try{
                this.editing = true;
                await updateCurrentUserProfile({...this.profile});              
            }catch(error) {
                //TODO...
            }
            this.editing = false;
        },
    },
    mounted() {
        subscribeToAuthUserChanges(newUserState => {
            this.profile = {
                bio: newUserState.bio,
                display_name: newUserState.display_name,
            }
        });
    }
}
</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

    <form 
        action="#" 
        @submit.prevent="handleSubmit"
    >

    <div class="mb-4">
        <MainLabel for="bio" class="block mb-2">Biografía</MainLabel>
        <textarea 
        v-model="profile.bio" 
        id="bio" 
        class="w-full p-2 border borer-gray-400 rounded"></textarea>
    </div>
    <div class="mb-4">
        <MainLabel for="display_name" class="block mb-2">Nombre de usuario</MainLabel>
        <input 
            v-model="profile.display_name" 
            type="text " 
            id="display_name" 
            class="w-full p-2 border borer-gray-400 rounded" 
        >
    </div>
            <MainButton type="submit">
                <!-- <span :disabled="loading" v-if="loading"
                    class="animate-spin inline-block mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> -->
                Actualizar perfil
            </MainButton>

    </form>
</template>