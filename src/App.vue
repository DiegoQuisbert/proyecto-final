<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuthUserChanges } from './services/auth';

export default {
    name: 'App',

    components: { Home },
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
            <nav class="flex flex-col w-56 bg-slate-800 text-white p-6 shadow-lg rounded-r-xl">
                <RouterLink class="text-2xl font-bold mb-8 hover:text-blue-400 transition" to="/">
                    DV Social
                </RouterLink>

                <ul class="flex flex-col gap-3 text-sm">
                    <li>
                        <RouterLink to="/" class="block py-2 px-4 rounded hover:bg-slate-700 transition">
                            <!-- <HomeIcon class="inline w-4 h-4 mr-2" /> -->
                            Home
                        </RouterLink>
                    </li>

                    <template v-if="user.id !== null">
                        <li>
                            <RouterLink to="/posts" class="block py-2 px-4 rounded hover:bg-slate-700 transition">
                                Posts
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/mi-perfil" class="block py-2 px-4 rounded hover:bg-slate-700 transition">
                                Mi perfil
                            </RouterLink>
                        </li>
                        <li>
                            <form @submit.prevent="handleLogout">
                                <button type="submit"
                                    class="cursor-pointer w-full text-left py-2 px-4 rounded hover:bg-slate-700 transition">
                                    {{ user.email }} (Cerrar sesión)
                                </button>
                            </form>
                        </li>
                    </template>

                    <template v-else>
                        <li>
                            <RouterLink to="/iniciar-sesion"
                                class="block py-2 px-4 rounded hover:bg-slate-700 transition">
                                Login
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/crear-cuenta"
                                class="block py-2 px-4 rounded hover:bg-slate-700 transition">
                                Register
                            </RouterLink>
                        </li>
                    </template>
                </ul>
            </nav>

            <main class="flex-1 p-6 bg-gray-100">
                <RouterView />
            </main>
        </div>

        <footer class="h-16 bg-slate-900 text-white flex items-center justify-center text-sm">
            <p>Da Vinci &copy; 2025</p>
        </footer>
    </div>
</template>
