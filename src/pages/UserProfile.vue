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
        };
    },
    async mounted() {
        try {
            this.loadingUser = true;
            this.user = await getUserProfileById(this.$route.params.id);
        } catch (error) {
            //TODO...
        }
        this.loadingUser = false;
    },
};
</script>

<template>
    <div 
        v-if="!loadingUser" 
        class="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-xl space-y-6"
    >
        <div class="flex justify-between items-center">
            <MainH1>Perfil de {{ user.display_name || user.email }}</MainH1>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 italic min-h-[80px]">
            {{ user.bio || 'Acá va mi biografía...' }}
        </div>
        <dl class="space-y-4 text-gray-800">
            <div>
                <dt class="text-sm font-semibold text-gray-500">Email</dt>
                <dd class="text-base">{{ user.email }}</dd>
            </div>
            <div>
                <dt class="text-sm font-semibold text-gray-500">Nombre de usuario</dt>
                <dd class="text-base">{{ user.display_name || 'Sin especificar' }}</dd>
            </div>
        </dl>
    </div>
    <MainLoader v-else />
</template>