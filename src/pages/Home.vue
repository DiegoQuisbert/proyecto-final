<script>
import MainH1 from '../components/MainH1.vue';

import bannerImg from '../assets/images/banner.png';

export default {
    name: 'Home',
    components: { MainH1 },
};
</script>

<template>
    <div>
        <div class="relative w-full h-[50vh] bg-neutral-900">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900 opacity-70"></div>
            <!-- Imagen opcional: <img :src="bannerImg" alt="Banner" class="w-full h-full object-cover" /> -->
        </div>

        <div class="mt-8 text-center px-6 max-w-5xl mx-auto">
            <MainH1>
                ¡Bienvenido a Bzzign!
            </MainH1>

            <div
                class="flex flex-col md:flex-row justify-center gap-12 mb-8 text-gray-700 text-base md:text-lg leading-relaxed">
                <p class="md:w-1/2 max-w-xl mx-auto text-justify">
                    Red social hecha para <b>jóvenes artistas</b> y <b>diseñadores</b>. ¡En esta red social podrás <b>compartir tu arte
                    con todo el mundo</b>! Además de tener las herramientas necesarias para facilitarte el <b>monetizar tu
                    trabajo</b>.
                </p>
                <p class="md:w-1/2 max-w-xl mx-auto text-justify">
                    Nuestra misión es que puedas contar con un <b>espacio cómodo y seguro</b> para que puedas <b>expresarte como
                    quieras</b>, enseñar tu arte, avances, obras terminadas y un largo etc.
                </p>
            </div>

            <div class="flex justify-center gap-6">
                <router-link 
                    to="/iniciar-sesion"
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105"
                >
                    Iniciar Sesión
                </router-link>
                <router-link 
                    to="/crear-cuenta"
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105">
                    Crear Cuenta
                </router-link>
            </div>
        </div>
    </div>
</template>
