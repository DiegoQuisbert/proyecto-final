<script setup>
import MainH1 from "../components/MainH1.vue";
import { RouterLink } from "vue-router";
import fondo from "../assets/images/fondo.png";
</script>

<template>
    <div class="relative min-h-screen flex">
        <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${fondo})` }"></div>

        <div class="relative z-10 flex w-full">
            <div class="w-1/2 flex items-center justify-center"></div>

            <div class="w-1/2 flex flex-col items-center justify-center p-8 space-y-5">
                <div class="flex flex-col items-center text-center space-y-3">
                    <MainH1 class="text-yellow-400">¡Diseñá, expresate y compartí en Bzzign!</MainH1>
                    <h2 class="text-3x1 font-bold text-purple-200">¿Qué esperás para unirte?</h2>
                </div>

                <div class="flex flex-col gap-3 items-center">
                    <button type="button"
                        class="w-56 cursor-pointer flex items-center justify-center text-gray-800 bg-[#dcdaed] hover:bg-[#dcdaed]/90 focus:ring-4 focus:outline-none focus:ring-[#dcdaed]/50 font-medium rounded-full text-sm px-5 py-2.5">
                        <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 18 19">
                            <path fill-rule="evenodd"
                                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                                clip-rule="evenodd" />
                        </svg>
                        Iniciá con Google
                    </button>

                    <button type="button"
                        class="w-56 cursor-pointer flex items-center justify-center text-gray-800 bg-[#dcdaed] hover:bg-[#dcdaed]/90 focus:ring-4 focus:outline-none focus:ring-[#dcdaed]/50 font-medium rounded-full text-sm px-5 py-2.5">
                        <svg class="w-5 h-5 mr-3 scale-125" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 30 30">
                            <path
                                d="M 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 25.105 4.895 26 6 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 6 C 26 4.895 25.105 4 24 4 L 6 4 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z">
                            </path>
                        </svg>
                        Iniciá con X
                    </button>
                </div>


                <hr class="h-px my-8 bg-gray-300 border-0 w-48" />

                <div class="flex flex-col gap-3 items-center">
                    <RouterLink
                        class="w-56 py-2.5 px-5 text-sm font-medium text-gray-900 bg-[#dcdaed] rounded-full border border-gray-300 hover:bg-[#dcdaed]/90 focus:ring-4 focus:ring-gray-100"
                        to="crear-cuenta">
                        Crear cuenta
                    </RouterLink>
                    <h2 class="text-3x1 text-purple-200 font-bold">¿Ya tenés una cuenta?</h2>
                    <RouterLink
                        class="w-56 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                        to="iniciar-sesion">
                        Iniciá sesión
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
