<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { MainH1, MainLabel, MainButton },
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
                <MainLabel for="email">Email</MainLabel>
                <input 
                    v-model="user.email" 
                    type="email" 
                    id="email" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="ejemplo@correo.com"
                >
            </div>

            <div>
                <MainLabel for="password">Contraseña</MainLabel>
                <input 
                    v-model="user.password" 
                    type="password" 
                    id="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••">
            </div>

            <MainButton type="submit">
                <!-- <span :disabled="loading" v-if="loading"
                    class="animate-spin inline-block mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> -->
                Ingresar
            </MainButton>
        </form>
    </div>
</template>