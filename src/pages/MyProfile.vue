<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToAuthUserChanges } from '../services/auth';

export default {
    name: 'MyProfile',
    components: { MainH1 },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
            },
        };
    },
    mounted() {
        subscribeToAuthUserChanges(newUserData => this.user = newUserData);
    },
};
</script>

<template>
    <div class="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-xl space-y-6">

        <div class="flex justify-between items-center">
            <MainH1 class="text-2xl font-bold text-gray-800">Mi perfil</MainH1>
            <RouterLink 
                to="/mi-perfil/editar" 
                class="text-sm text-blue-600 font-semibold hover:underline"
            >
                Editar
            </RouterLink>
        </div>

        <div>
            <dt class="text-sm font-semibold text-gray-500">Nombre de usuario</dt>
            <dd class="text-base">{{ user.display_name || 'Sin especificar' }}</dd>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 italic min-h-[80px]">
            {{ user.bio || 'Acá va mi biografía...' }}
        </div>

        <dl class="space-y-4 text-gray-800">
            <div>
                <dt class="text-sm font-semibold text-gray-500">Email</dt>
                <dd class="text-base">{{ user.email }}</dd>
            </div>

        </dl>

    </div>
</template>