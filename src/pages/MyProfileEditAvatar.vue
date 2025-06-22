<script setup>
import { onUnmounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { updateCurrentUserAvatar } from '../services/auth';

const { avatar, editing, handleFileChange, handleSubmit } = useProfileEditAvatarForm();

function useProfileEditAvatarForm(){
    const avatar = ref({
        file: null,
        preview: null,
    });
    const editing = ref(false);

    async function handleSubmit(){
        try {
            editing.value = true;
            await updateCurrentUserAvatar(avatar.value.file);
        } catch (error) {
            
        }
        editing.value = false;
    }

    function handleFileChange(event){
        const selectedFile = event.target.files[0];
        console.log(event.target.file);

        if(!selectedFile) {
            if(avatar.value.preview) URL.revokeObjectURL(avatar.value.preview);

            avatar.value = {
                file: null,
                preview: null,
            }
            return;
        }

        avatar.value.file = selectedFile;

        avatar.value.preview = URL.createObjectURL(avatar.value.file);
    }

    onUnmounted(() => (avatar.value.preview) ? URL.revokeObjectURL(avatar.value.preview) : null )

    return({
        avatar,
        editing,
        handleFileChange,
        handleSubmit,
    })
}

</script>
<template>
    <MainH1>Editar mi imágen de perfil</MainH1>

    <form 
        action="#"
        class="flex gap-4"
        @submit.prevent="handleSubmit"
    >
        <div class="w-1/2">
            <div class="mb-4">
                <MainLabel for="avatar">Nueva imágen</MainLabel>
                <input 
                    type="file"
                    id="avatar"
                    class="w-full p-2 border border-gray-500 rounded"
                    @change="handleFileChange"
                >
            </div>
            <MainButton>Actualizar mi imágen de perfil</MainButton>
        </div>
        <div class="w-1/2">
            <h2 class="sr-only">Previsualización de la imágen seleccionada</h2>
            <img 
                v-if="avatar.preview"
                :src="avatar.preview" 
                alt=""
            >
        </div>
    </form>
</template>