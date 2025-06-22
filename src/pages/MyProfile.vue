<script setup>
import MainH1 from '../components/MainH1.vue';
import useAuthUserState from '../composables/useAuthUserState';

const { user } = useAuthUserState();

</script>

<template>
    <div class="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-xl space-y-6">

        <div class="flex justify-between items-center">
            <MainH1>Mi perfil</MainH1>
            <RouterLink to="/mi-perfil/editar" class="text-sm text-blue-600 font-semibold hover:underline">Editar
            </RouterLink>
            <RouterLink to="/mi-perfil/editar/avatar" class="text-sm text-blue-600 font-semibold hover:underline">Editar
                mi imágen
            </RouterLink>
        </div>

        <div class="p-4 bg-slate-200">
            <img
                v-if="user.avatar"
                :src="user.avatarURL" 
                alt="foto de perfil">
        </div>
        <div class="flex gap-4">
        
            <div>
                <dt class="text-sm font-semibold text-gray-500">Nombre de usuario</dt>
                <dd class="text-base">{{ user.display_name || 'Sin especificar' }}</dd>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 italic min-h-[80px]">
                {{ user.bio || 'Acá va mi biografía...' }}
            </div>
            <dl class="space-y-4 text-gray-800">
                <div>
                    <dt class="text-sm font-semibold text-gray-500">Pronombres</dt>
                    <dd class="text-base">{{ user.pronoums }}</dd>
                </div>
            </dl>
            <dl class="space-y-4 text-gray-800">
                <div>
                    <dt class="text-sm font-semibold text-gray-500">Email</dt>
                    <dd class="text-base">{{ user.email }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>