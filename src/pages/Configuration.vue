<script setup>
import Layout from '../components/Layout.vue';
import MainH1 from '../components/MainH1.vue';
import {
    useRouter
} from 'vue-router';
import {
    logout
} from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';

defineProps({
    showAside: {
        type: Boolean,
        default: true,
    },
});

const router = useRouter();
const {
    handleLogout
} = useLogout(router);
const {
    user
} = useAuthUserState();

function useLogout(router) {
    function handleLogout() {
        logout();
        router.push('/');
    }

    return {
        handleLogout,
    };
}
</script>

<template>
    <Layout>
        <div class="flex items-center gap-2">
            <RouterLink to="/posts" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                aria-label="Volver a posts">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d" class="w-7 h-7 mr-1"
                    style="flex-shrink: 0;" aria-hidden="true">
                    <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                    <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                </svg>
            </RouterLink>

            <MainH1>Configuración</MainH1>
        </div>
        <form @submit.prevent="handleLogout">
            <button type="submit"
                class="w-full text-left px-4 py-3 rounded-lg text-[#1b1c1a] hover:text-red-600 transition cursor-pointer">Cerrar
                sesión</button>
        </form>
    </Layout>
</template>