<script setup>
defineProps({
    userSlug: {
        type: String,
        required: true
    }
});
</script>

<template>
    <ul class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex light:divide-gray-700 light:text-gray-400">
        <li class="w-full focus-within:z-10">
            <RouterLink :to="`/perfil/${userSlug}`"
                class="inline-block w-full p-4 text-gray-900 bg-white border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                exact-active-class="bg-gray-100">Posts</RouterLink>
        </li>
        <li class="w-full focus-within:z-10">
            <RouterLink :to="`/perfil/${userSlug}/portfolio`"
                class="inline-block w-full p-4 bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                active-class="bg-gray-100">PortFolio</RouterLink>
        </li>
        <li class="w-full focus-within:z-10">
            <RouterLink :to="`/perfil/${userSlug}/multimedia`"
                class="inline-block w-full p-4 bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                active-class="bg-gray-100">Multimedia</RouterLink>
        </li>
        <li class="w-full focus-within:z-10">
            <RouterLink :to="`/perfil/${userSlug}/respuestas`"
                class="inline-block w-full p-4 bg-white border-gray-200 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300"
                active-class="bg-gray-100">Respuestas</RouterLink>
        </li>
    </ul>
</template>