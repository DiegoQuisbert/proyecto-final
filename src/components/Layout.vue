<script setup>

//Los svg fueron primero tomados por mí y re-adaptados para que encajen por medio de ChatGPT

import useAuthUserState from '../composables/useAuthUserState';
import SideBar from './SideBar.vue';
import Logo from "../assets/images/Logo_500x500.png";

defineProps({
    showAside: {
        type: Boolean,
        default: true,
    },
});

const {
    user
} = useAuthUserState();

</script>

<template>
    <div class="flex">

        <!-- Navegador del lado izquierdo -->
        <nav class="fixed left-0 w-92 h-screen bg-[#2d3c7d] p-4">
            <RouterLink to="/posts" class="mb-3 flex justify-center items-center w-[100px] h-[100px]">
                <img :src="Logo" alt="Logo" class="object-contain" />
            </RouterLink>

            <ul class="flex flex-col text-lg font-semibold">
                <li class="mb-2">
                    <RouterLink to="/posts"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition group">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.2"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <path
                                d="M9 20H7C5.89543 20 5 19.1046 5 18V10.9199C5 10.336 5.25513 9.78132 5.69842 9.40136L10.6984 5.11564C11.4474 4.47366 12.5526 4.47366 13.3016 5.11564L18.3016 9.40136C18.7449 9.78132 19 10.336 19 10.9199V18C19 19.1046 18.1046 20 17 20H15M9 20V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V20M9 20H15"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Inicio
                    </RouterLink>
                </li>
                <li class="mb-2">
                    <RouterLink to="/mi-perfil"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition group">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <g id="SVGRepo_iconCarrier">
                                <g filter="url(#filter0_d_15_82)">
                                    <path
                                        d="M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z" />
                                </g>
                            </g>
                            <defs>
                                <filter id="filter0_d_15_82" x="2.55444" y="3.5" width="18.8911" height="19"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="1" />
                                    <feGaussianBlur stdDeviation="0.5" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_82" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_82"
                                        result="shape" />
                                </filter>
                            </defs>
                        </svg>

                        Perfil
                    </RouterLink>
                </li>
                <li class="mb-2">
                    <RouterLink to="/notificaciones"
                        class=" px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition flex items-center space-x-2">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M6.44784 7.96942C6.76219 5.14032 9.15349 3 12 3V3C14.8465 3 17.2378 5.14032 17.5522 7.96942L17.804 10.2356C17.8072 10.2645 17.8088 10.279 17.8104 10.2933C17.9394 11.4169 18.3051 12.5005 18.8836 13.4725C18.8909 13.4849 18.8984 13.4973 18.9133 13.5222L19.4914 14.4856C20.0159 15.3599 20.2782 15.797 20.2216 16.1559C20.1839 16.3946 20.061 16.6117 19.8757 16.7668C19.5971 17 19.0873 17 18.0678 17H5.93223C4.91268 17 4.40291 17 4.12434 16.7668C3.93897 16.6117 3.81609 16.3946 3.77841 16.1559C3.72179 15.797 3.98407 15.3599 4.50862 14.4856L5.08665 13.5222C5.10161 13.4973 5.10909 13.4849 5.11644 13.4725C5.69488 12.5005 6.06064 11.4169 6.18959 10.2933C6.19123 10.279 6.19283 10.2645 6.19604 10.2356L6.44784 7.96942Z" />
                                <path
                                    d="M8 17C8 17.5253 8.10346 18.0454 8.30448 18.5307C8.5055 19.016 8.80014 19.457 9.17157 19.8284C9.54301 20.1999 9.98396 20.4945 10.4693 20.6955C10.9546 20.8965 11.4747 21 12 21C12.5253 21 13.0454 20.8965 13.5307 20.6955C14.016 20.4945 14.457 20.1999 14.8284 19.8284C15.1999 19.457 15.4945 19.016 15.6955 18.5307C15.8965 18.0454 16 17.5253 16 17" />
                            </g>
                        </svg>
                        <span>Notificaciones</span>
                    </RouterLink>
                </li>

                <li class="mb-2">
                    <RouterLink to="/mensajes"
                        class=" px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition flex items-center space-x-2">

                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" />
                            </g>
                        </svg>

                        <span>Mensajes</span>
                    </RouterLink>
                </li>

                <li class="mb-2">
                    <RouterLink to="/guardados"
                        class=" px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition flex items-center space-x-2">

                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" />
                            </g>
                        </svg>

                        <span>Guardados</span>
                    </RouterLink>
                </li>

                <li class="mb-2">
                    <RouterLink to="/configuraciones"
                        class=" px-4 py-3 rounded-lg hover:bg-[#2d3c7d]/50 text-purple-200 hover:text-yellow-400 transition flex items-center space-x-2">
                        <svg width="32px" height="32px" viewBox="-0.5 0 25 25" fill="none"
                            xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.25"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="transition-colors duration-200 group-hover:stroke-yellow-400">
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M18.8887 10.25C18.5395 10.2462 18.1974 10.151 17.8964 9.97387C17.5954 9.79677 17.3461 9.54393 17.1731 9.24053C17.0002 8.93714 16.9097 8.59372 16.9107 8.2445C16.9117 7.89528 17.0041 7.55241 17.1787 7.24999L17.2987 7.03997C17.4297 6.81781 17.5133 6.57097 17.5443 6.31493C17.5753 6.0589 17.553 5.79924 17.4788 5.55224C17.4046 5.30524 17.2801 5.07626 17.1132 4.87969C16.9462 4.68312 16.7404 4.52317 16.5087 4.40996V4.40996C16.0227 4.17652 15.467 4.13332 14.9507 4.28875C14.4345 4.44418 13.995 4.78704 13.7187 5.24999V5.24999C13.5404 5.54389 13.2894 5.78686 12.9899 5.9555C12.6903 6.12413 12.3524 6.21276 12.0087 6.21276C11.665 6.21276 11.327 6.12413 11.0275 5.9555C10.728 5.78686 10.4769 5.54389 10.2987 5.24999C10.0224 4.78704 9.58291 4.44418 9.06665 4.28875C8.5504 4.13332 7.99469 4.17652 7.5087 4.40996V4.40996C7.27697 4.52317 7.07116 4.68312 6.90421 4.87969C6.73726 5.07626 6.61277 5.30524 6.53858 5.55224C6.46438 5.79924 6.44209 6.0589 6.47309 6.31493C6.50408 6.57097 6.5877 6.81781 6.71869 7.03997L6.83869 7.24999C7.01332 7.55241 7.10571 7.89528 7.10669 8.2445C7.10767 8.59372 7.01721 8.93714 6.84427 9.24053C6.67134 9.54393 6.42196 9.79677 6.12097 9.97387C5.81999 10.151 5.4779 10.2462 5.12869 10.25C4.64217 10.238 4.16698 10.3979 3.78659 10.7015C3.40621 11.005 3.14493 11.4329 3.04868 11.91C2.99868 12.1996 3.01314 12.4967 3.09101 12.7801C3.16887 13.0635 3.30826 13.3263 3.49921 13.5497C3.69016 13.7731 3.92799 13.9516 4.1958 14.0727C4.46362 14.1937 4.75481 14.2543 5.04868 14.25H5.1687C5.5179 14.2538 5.86 14.349 6.16098 14.5261C6.46196 14.7032 6.71131 14.9561 6.88425 15.2595C7.05718 15.5628 7.14768 15.9063 7.1467 16.2555C7.14572 16.6047 7.05333 16.9476 6.87869 17.25L6.82868 17.33C6.56685 17.7935 6.4956 18.3407 6.62998 18.8558C6.76435 19.3709 7.0938 19.8135 7.54868 20.09V20.09C8.00218 20.351 8.53992 20.4239 9.04654 20.293C9.55316 20.1622 9.98834 19.838 10.2587 19.39L10.2787 19.25C10.457 18.9561 10.708 18.7131 11.0075 18.5445C11.307 18.3759 11.6449 18.2872 11.9887 18.2872C12.3324 18.2872 12.6704 18.3759 12.9699 18.5445C13.2694 18.7131 13.5204 18.9561 13.6987 19.25L13.7687 19.39C14.0391 19.8407 14.4761 20.1668 14.9851 20.2978C15.4942 20.4288 16.0343 20.3542 16.4887 20.09C16.9367 19.8197 17.2609 19.3845 17.3917 18.8779C17.5226 18.3712 17.4497 17.8335 17.1887 17.38L17.1287 17.27C16.9541 16.9676 16.8617 16.6247 16.8607 16.2754C16.8597 15.9262 16.9502 15.5829 17.1231 15.2795C17.296 14.9761 17.5454 14.7232 17.8464 14.5461C18.1474 14.369 18.4895 14.2738 18.8387 14.27H18.9587C19.2525 14.2743 19.5438 14.2138 19.8116 14.0927C20.0794 13.9717 20.3172 13.793 20.5082 13.5696C20.6991 13.3462 20.8385 13.0835 20.9164 12.8001C20.9942 12.5167 21.0087 12.2196 20.9587 11.93C20.8669 11.451 20.6088 11.0198 20.2301 10.7124C19.8514 10.405 19.3763 10.2413 18.8887 10.25V10.25Z" />
                                <path
                                    d="M12 14.79C13.3807 14.79 14.5 13.6707 14.5 12.29C14.5 10.9093 13.3807 9.78998 12 9.78998C10.6193 9.78998 9.5 10.9093 9.5 12.29C9.5 13.6707 10.6193 14.79 12 14.79Z" />
                            </g>
                        </svg>
                        <span>Configuración</span>
                    </RouterLink>
                </li>
                <li class="mb-2">
                    <RouterLink to="/mi-perfil"
                        class="block px-4 py-3 rounded-lg bg-[#dcdaed] hover:bg-[#eaa944] text-gray-800 hover:text-[#2d3c7d] transition">
                        {{ user.display_name }}
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <!-- Contenido principal -->
        <main class="flex-1 min-h-screen pl-[23rem] pr-[23rem]">
            <slot />
        </main>
        <!-- Buscador del lado derecho  -->
        <aside v-if="showAside" class="fixed right-0 w-92 h-screen border-gray-200 p-3 bg-gray-50">
            <SideBar />
        </aside>
    </div>
</template>
