<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPostById, EditPost } from "../services/posts";
import useAuthUserState from "../composables/useAuthUserState";
import Layout from "../components/Layout.vue";
import MainLoader from "../components/MainLoader.vue";
import MainH1 from "../components/MainH1.vue";
import MainLabel from "../components/MainLabel.vue";

const { user } = useAuthUserState();
const route = useRoute();
const router = useRouter();

const post = ref({
    id: null,
    body: "",
    sender_id: null,
});

const editingPost = ref(false);

onMounted(async () => {
    try {
        const postData = await getPostById(route.params.id);
        if (postData.sender_id !== user.value.id) {
            router.push("/posts");
        }
        post.value = postData;
    } catch (error) {
        console.error("Error al cargar el post: ", error);
        router.push("/posts");
    }
});

const handleEditPost = async () => {
    try {
        editingPost.value = true;
        await EditPost(post.value.id, {
            body: post.value.body
        });
        router.push("/posts");
    } catch (error) {
        console.error("Error al editar el post: ", error);
    } finally {
        editingPost.value = false;
    }
};
</script>


<template>
    <Layout>
        <div class="max-w-xl mx-auto mt-8">
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
                    class="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[150px]">
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
