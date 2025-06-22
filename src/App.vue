<script setup>
import { useRouter } from 'vue-router';
import SideBar from './pages/SideBar.vue';
import { logout, subscribeToAuthUserChanges } from './services/auth';
import useAuthUserState from './composables/useAuthUserState';

const router = useRouter();
const { handleLogout } = useLogout(router);
const { user } = useAuthUserState();

function useLogout(router) {
    function handleLogout(){
        logout();
        router.push('/iniciar-sesion');
    }

    return {
        handleLogout,
    }
}

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-1">
            <nav class="sticky top-0 flex flex-col w-72 bg-white text-gray-900 border-r border-gray-200 p-6 h-screen">
                <RouterLink class="text-3xl font-extrabold mb-10 px-2 py-2 hover:text-yellow-400 transition" to="/">
                    Bzzign
                </RouterLink>

                <ul class="flex flex-col gap-3 text-lg font-medium">
                    <li>
                        <RouterLink to="/"
                            class="block px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400 transition">
                            Home
                        </RouterLink>
                    </li>

                    <template v-if="user.id !== null">
                        <li>
                            <RouterLink to="/posts"
                                class="block px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400 transition">
                                Posts
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/mi-perfil"
                                class="block px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400 transition">
                                Mi perfil
                            </RouterLink>
                        </li>
                        <li>
                            <form @submit.prevent="handleLogout">
                                <button type="submit"
                                    class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400 transition cursor-pointer">
                                    {{ user.email }} (Cerrar sesión)
                                </button>
                            </form>
                        </li>
                    </template>

                    <template v-else>
                        <li>
                            <RouterLink to="/iniciar-sesion"
                                class="block px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400 transition">
                                Login
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/crear-cuenta"
                                class="block px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-yellow-400   transition">
                                Register
                            </RouterLink>
                        </li>
                    </template>
                </ul>
            </nav>


            <main class="flex-1 w-full h-screen overflow-y-auto">
                <RouterView />
            </main>

            <aside class="sticky top-0 w-80 border-l border-gray-200 p-6 bg-gray-50 h-screen overflow-y-auto">
                <SideBar />
            </aside>
        </div>


    </div>
</template>
