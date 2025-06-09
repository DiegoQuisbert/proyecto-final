<script>
import MainH1 from '../components/MainH1.vue';


import bannerImg from '../assets/images/banner.png';


export default {
    name: 'Home',
    components: { MainH1 },
};
</script>


<template>
    <div class="h-[600px] relative bg-gray-900 hover:bg-gray-800 transition-transform duration-200">
        <div class="absolute inset-0 z-[1]">
            <div class="h-full w-full"></div>
            <!-- TODO cuando pueda agregar un banner:
        <img class="h-full w-full object-cover object-center" src="URL" alt="Fondo" />
        -->
        </div>


        <div class="relative z-[2] px-6 md:px-8 lg:px-10 max-w-6xl mx-auto h-full flex items-center">
            <div class="w-full space-y-6 text-gray-50">


                <MainH1 class="text-yellow-400">
                    ¡Bienvenido a Bzzign!
                </MainH1>


                <div class="space-y-6 md:space-y-0 md:flex md:gap-12 text-base md:text-lg leading-relaxed">
                    <p
                        class="relative before:content-[''] before:absolute before:w-px before:h-full before:left-0 before:top-0 before:-translate-x-4 before:bg-gray-500 md:w-1/2 text-justify font-light ml-4">
                        Red social hecha para <b>jóvenes artistas</b> y <b>diseñadores</b>. ¡En esta red social podrás
                        <b>compartir tu arte con todo el mundo</b>! Además de tener las herramientas necesarias para
                        facilitarte el
                        <b>monetizar tu trabajo</b>.
                    </p>
                    <p
                        class="relative before:content-[''] before:absolute before:w-px before:h-full before:left-0 before:top-0 before:-translate-x-4 before:bg-gray-500 md:w-1/2 text-justify font-light ml-4">
                        Nuestra misión es que puedas contar con un <b>espacio cómodo y seguro</b> para que puedas
                        <b>expresarte como quieras</b>, enseñar tu arte, avances, obras terminadas y un largo etc.
                    </p>
                </div>


                <div class="flex flex-col md:flex-row gap-4 pt-6">
                    <router-link to="/iniciar-sesion"
                        class="inline-block text-base font-medium px-12 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105">
                        Iniciar Sesión
                    </router-link>
                    <router-link to="/crear-cuenta"
                        class="inline-block text-base font-medium px-12 py-3 border border-yellow-500 text-yellow-400 rounded-lg bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-transform duration-200 transform hover:scale-105">
                        Crear Cuenta
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
                class="w-full h-150 bg-gray-900 rounded-lg hover:bg-gray-500 transition-transform duration-200 transform hover:scale-102">
            </div>


            <div class="space-y-4 text-justify">
                <MainH1>Nuestro rol como desarrolladores</MainH1>
                <p>
                    Como desarrolladores de <b>Bzzign</b>, nuestro equipo busca la <b>comodidad</b> y el
                    <b>bienestar</b> de <b>nuestros
                        usuarios</b>,
                    le damos la mano a todo joven artista que quiera <b>compartir</b> su <b>arte</b> o comerciarlo con
                    otros usuarios.
                </p>
                <p>
                    La <b>comodidad</b> que brinda una red social de este estilo es <b>importante</b>, para garantizar
                    la <b>familiaridad</b>
                    con
                    todo usuario que llegase directamente de otra red, por eso optamos por una <b>interfaz cómoda</b> y
                    parecida en sí
                    a otras redes sociales.
                </p>
            </div>
        </div>
    </div>
    <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-justify">
                <MainH1>Detalles comerciales</MainH1>
                <p>El acceso a la página es <b>gratuito</b>, así como la creación de cuentas, <b>subir</b> y ver
                    <b>publicaciones</b>, al ser una <b>red social libre</b> y enfocada a <b>gente joven</b>, es
                    importante que puedan <b>ingresar fácilmente</b>.
                </p>
                <p>El método de <b>monetización</b> sería mediante <b>anuncios no invasivos</b> en la misma página, que
                    se mostrarían como cualquier otro post</p>
                <p>Además de ello, se añadiría un sistema de <b>membresía</b>, que <b>quitaría</b> estos <b>anuncios</b>
                    y te pondría un <b>"verificado"</b> en el perfil</p>
            </div>
            <div
                class="w-full h-150 bg-gray-900 rounded-lg hover:bg-gray-500 transition-transform duration-200 transform hover:scale-102">
            </div>
        </div>
    </div>


    <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-justify">
                <MainH1>Misión</MainH1>
                <p>Dar un <b>espacio</b> más <b>sano</b> y <b>cómodo</b> a aquellos usuarios que en su momento hayan
                    <b>sufrido</b> de <b>las políticas</b> y el uso de las <b>IAs de generación de imágen</b> en otras
                    redes.</p>


            </div>
            <div class="space-y-4 text-justify">
                <MainH1>Visión</MainH1>
                <p>Ser la <b>principal alternativa</b> para todo <b>joven diseñador</b> que quiera compartir su arte con el resto, la
                    <b>formación de comunidades</b> fieles y ser una <b>opción viable</b> para la realización de <b>comisiones</b>.</p>
            </div>
        </div>
    </div>


    <footer class="h-16 bg-slate-900 text-white flex items-center justify-center text-sm">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>