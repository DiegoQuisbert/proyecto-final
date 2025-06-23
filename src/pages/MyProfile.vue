<script setup>
import Layout from "../components/Layout.vue";
import useAuthUserState from "../composables/useAuthUserState";

const { user } = useAuthUserState();
</script>

<template>

    <Layout>
        <div class="max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="flex justify-end space-x-3 p-4">
                <RouterLink to="/mi-perfil/editar" class="text-sm text-blue-600 font-semibold hover:underline">
                    Editar
                </RouterLink>
            </div>

            <div class="flex flex-col items-center p-6">
                <img v-if="user.avatar" :src="user.avatarURL" alt="foto de perfil"
                    class="w-24 h-24 rounded-full shadow-lg" />

                <span class="text-sm font-semibold text-gray-500 mt-4">Nombre de usuario</span>
                <h5 class="mb-1 text-xl font-medium text-gray-900">
                    {{ user.display_name || 'Sin especificar' }}
                </h5>
                <div class="text-base text-gray-800">
                    {{ user.email }}
                </div>

                <div class="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <p class="mb-3 text-gray-700 italic">
                        {{ user.bio || 'Acá va mi biografía...' }}
                    </p>
                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Pronombres</span>
                            <div class="text-base text-gray-800">
                                {{ user.pronoums }}
                            </div>
                        </div>
                        <div class="w-1/2">
                            <span class="text-sm font-semibold text-gray-500">Ubicación</span>
                            <div class="text-base text-gray-800">
                                {{ user.location }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    </Layout>

</template>
