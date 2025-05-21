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
        }
    },

    mounted() {
        subscribeToAuthUserChanges(newUserData => this.user = newUserData);
    },
}
</script>

<template>
    <div class="flex-items-end gap-4">
        <MainH1>Mi perfil</MainH1>
        <RouterLink
        to="/mi-perfil/editar"
        class="mb-4 text-blue-700"
        >
            Editar
        </RouterLink>
    </div>

    <div class="p-4 italic">{{user.bio || 'Acá va mi biografía...'}}</div>

    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="font-bold">Nombre de usuario</dt>
        <dd class="mb-2">{{ user.display_name || 'Sin especificar' }}</dd>
    </dl>
</template>