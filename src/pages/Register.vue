<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { register } from '../services/auth';

export default {
    name: 'Register',
    components: { MainH1, MainLabel },
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
                await register(this.user.email, this.user.password);
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
        <MainH1>Crear una cuenta</MainH1>

        <form 
            @submit.prevent="handleSubmit" 
            class="space-y-6"
        >
            <div>
                <MainLabel for="email">Email</MainLabel>
                <input 
                    v-model="user.email" 
                    type="email" id="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                >
            </div>

            <div>
                <MainLabel for="password">Contraseña</MainLabel>
                <input 
                    v-model="user.password" 
                    type="password" 
                    id="password" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                >
            </div>

            <MainButton type="submit">
                <!-- <span :disabled="loading" v-if="loading"
                    class="animate-spin inline-block mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> -->
                Crear cuenta
            </MainButton>
            </form>
    </div>
</template>