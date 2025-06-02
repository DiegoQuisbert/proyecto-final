<script>
import Home from './pages/Home.vue';
import SideBar from './pages/SideBar.vue';
import { logout, subscribeToAuthUserChanges } from './services/auth';

export default {
    name: 'App',

    components: { Home, SideBar },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/iniciar-sesion');
        },
    },
    async mounted() {
        subscribeToAuthUserChanges(newUserData => (this.user = newUserData));
    },
};
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-1">
            <nav class="flex flex-col w-72 bg-white text-gray-900 border-r border-gray-200 p-6 min-h-screen">
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


            <main class="flex-1 w-full overflow-y-auto">
                <RouterView />
            </main>

            <aside class="w-80 border-l border-gray-200 p-6 bg-gray-50">
                <SideBar />
            </aside>
        </div>

        <footer class="h-16 bg-slate-900 text-white flex items-center justify-center text-sm">
            <p>Da Vinci &copy; 2025</p>
        </footer>
    </div>
</template>
