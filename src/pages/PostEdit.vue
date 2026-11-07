<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import useAuthUserState from "../composables/useAuthUserState";
import usePostEdit from '../composables/usePostEdit';

import Layout from "../components/Layout.vue";
import MainLoader from "../components/MainLoader.vue";
import MainH1 from "../components/MainH1.vue";
import MainLabel from "../components/MainLabel.vue";
import AlertBox from '../components/AlertBox.vue';

const { user } = useAuthUserState();
const route = useRoute();
const { post, loadingPost, editingPost, error, handleEditPost } = usePostEdit(computed(() => route.params.id), user);
</script>


<template>
    <Layout>
        <MainLoader v-if="loadingPost" />
        <AlertBox v-else-if="error" :content="{ message: error, type: 'error' }" />
        <div v-else class="max-w-xl mx-auto mt-8">
            <div class="flex items-center gap-2">
                    <RouterLink to="/posts" class="text-blue-600 hover:underline font-medium flex items-center mb-4"
                        aria-label="Volver a posts">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#2d3c7d"
                            class="w-7 h-7 mr-1" style="flex-shrink: 0;" aria-hidden="true">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                            <path
                                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                        </svg>
                    </RouterLink>

                    <MainH1>Editar Post</MainH1>
                </div>
            <MainLabel for="edit"/>
            <textarea id="edit" v-model="post.body" rows="6"
                class="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"></textarea>

            <div class="mt-4 text-right">
                <button @click="handleEditPost" :disabled="editingPost"
                    class="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-37.5">
                    <template v-if="editingPost">
                        <MainLoader />
                    </template>
                    <template v-else>
                        Guardar cambios
                    </template>
                </button>
            </div>
        </div>
    </Layout>
</template>
