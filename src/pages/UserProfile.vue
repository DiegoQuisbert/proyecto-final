<script>
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { getUserProfileById } from '../services/user-profiles';

export default {
    name: 'UserProfile',
    components: { MainH1, MainLoader },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
            },
            loadingUser: false,
        }
    },
    async mounted() {
        try {
            this.loadingUser = true;

            this.user = await getUserProfileById(this.$route.params.id);
        } catch (error) {
            //TODO...
        }
        this.loadingUser = false;
    }
}
</script>

<template>
    <template v-if="!loadingUser">
        <MainH1>Perfil de {{ user.email }}</MainH1>

        <div class="p-4 italic">{{ user.bio || 'Acá va mi biografía...' }} </div>

        <dl>
            <dt class="font-bold">Email</dt>
            <dd class="mb-2">{{ user.email }}</dd>
            <dt class="font-bold">Nombre de usuario</dt>
            <dd class="mb-2">{{ user.display_name || 'Sin especificar' }}</dd>
        </dl>
    </template>
    <MainLoader v-else />
</template>