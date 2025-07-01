<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPostById, EditPost } from "../services/posts";
import useAuthUserState from "../composables/useAuthUserState";
import Layout from "../components/Layout.vue";

    const {
        user
    } = useAuthUserState();
    const route = useRoute();
    const router = useRouter();

    const post = ref({
        id: null,
        body: "",
        sender_id: null,
    });

    onMounted(async () => {
        try {
            const postData = await getPostById(route.params
                .id);
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
            await EditPost(post.value.id, {
                body: post.value.body
            });
            router.push("/posts");
        } catch (error) {
            console.error("Error al editar el post: ", error);
        }
    };
</script>

<template>
<Layout>
    <div class="max-w-xl mx-auto mt-8">
        <h2 class="text-xl font-semibold mb-4">Editar Post</h2>

        <textarea v-model="post.body" rows="6"
            class="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"></textarea>

        <div class="mt-4 text-right">
            <button @click="handleEditPost" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Guardar cambios
            </button>
        </div>
    </div>
</Layout>
</template>
