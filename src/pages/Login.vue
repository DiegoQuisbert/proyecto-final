<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { MainH1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {

            try {
                this.loading = true;
                await login(this.user.email, this.user.password);
                this.loading = false;
            } catch (error) {
                //TODO...
            }
        }
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
        <MainH1>Ingresar a mi cuenta</MainH1>

        <form 
            @submit.prevent="handleSubmit" 
            class="space-y-6"
        >
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                    v-model="user.email" 
                    type="email" 
                    id="email" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                >
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                    v-model="user.password" 
                    type="password" 
                    id="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                >
            </div>

            <button type="submit" :disabled="loading"
                class="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                <span v-if="loading"
                    class="animate-spin inline-block mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                Ingresar
            </button>
        </form>
    </div>
</template>