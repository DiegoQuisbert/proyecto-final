<script setup>
    import MainH1 from '../components/MainH1.vue';
import ProfileLayout from '../components/ProfileLayout.vue';
</script>

<template>
    <ProfileLayout>
        <ul
            class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex light:divide-gray-700 light:text-gray-400">
            <li class="w-full focus-within:z-10">
                <RouterLink to="/mi-perfil"
                    class="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 light:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none light:bg-gray-700 light:text-white"
                    aria-current="page">Posts</RouterLink>
            </li>
            <li class="w-full focus-within:z-10">
                <RouterLink to="/mi-perfil/multimedia"
                    class="inline-block w-full p-4 bg-white border-r border-gray-200 light:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none light:hover:text-white light:bg-gray-800 light:hover:bg-gray-700">
                    Multimedia</RouterLink>
            </li>
            <li class="w-full focus-within:z-10">
                <RouterLink to="/mi-perfil/portfolio"
                    class="inline-block w-full p-4 bg-white border-r border-gray-200 light:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none light:hover:text-white light:bg-gray-800 light:hover:bg-gray-700">
                    PortFolio</RouterLink>
            </li>
            <li class="w-full focus-within:z-10">
                <RouterLink to="/mi-perfil/respuestas"
                    class="inline-block w-full p-4 bg-white border-s-0 border-gray-200 light:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 light:hover:text-white light:bg-gray-800 light:hover:bg-gray-700">
                    Respuestas</RouterLink>
            </li>
        </ul>

        <MainH1 class="mt-6 text-center">PortFolio</MainH1>
    </ProfileLayout>
</template>
