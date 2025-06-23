<script setup>
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';
import SideBar from './SideBar.vue';

const router = useRouter();
const { handleLogout } = useLogout(router);
const { user } = useAuthUserState();

function useLogout(router) {
    function handleLogout() {
        logout();
        router.push('/iniciar-sesion');
    }

    return {
        handleLogout,
    };
}
</script>

<template>
    <div class="flex min-h-screen">
        <nav class="sticky top-0 flex flex-col w-72 bg-[#2d3c7d] text-gray-900 border-r border-gray-200 p-6 h-screen">
            <RouterLink class="font-[Clear_Sans] text-3xl font-extrabold mb-10 px-2 py-2 text-purple-200 hover:text-yellow-400 transition"
                to="/posts">
                Bzzign
            </RouterLink>

            <ul class="flex flex-col gap-3 text-lg font-medium">
                <li>
                    <RouterLink to="/posts"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Inicio
                    </RouterLink>
                </li>

                <!-- <template v-if="user.id !== null"> -->
                <li>
                    <RouterLink to="/mi-perfil"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Perfil
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/notificaciones"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Notificaciones
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/mensajes"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Mensajes
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/guardados"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Guardados
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/configuraciones"
                        class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                        Configuración
                    </RouterLink>
                </li>
                <li>
                    <form @submit.prevent="handleLogout">
                        <button type="submit"
                            class="w-full text-left px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition cursor-pointer">
                            {{ user.email }} (Cerrar sesión)
                        </button>
                    </form>
                </li>
                <!-- </template> -->

                <!-- <template v-else>
                    <li>
                        <RouterLink to="/iniciar-sesion"
                            class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">Login
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/crear-cuenta"
                            class="block px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition">
                            Register</RouterLink>
                    </li>
                </template> -->
            </ul>
        </nav>

        <main class="flex-1 w-full h-screen overflow-y-auto">
            <slot />
        </main>

        <aside class="w-80 border-l border-gray-200 p-6 bg-gray-50 h-screen overflow-y-auto sticky top-0">
            <SideBar />
        </aside>
    </div>
</template>