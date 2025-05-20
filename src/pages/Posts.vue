<script>
import { nextTick } from "vue";
import MainH1 from "../components/MainH1.vue";
import { getLastPosts, listenForPost, savePost } from "../services/posts";

export default {
    name: "Post",
    components: { MainH1 },

    data() {
        return {
            posts: [],
            newPost: {
                email: "",
                body: "",
            },
        };
    },
    methods: {
        async sendPost() {
            try {
                savePost({
                    email: this.newPost.email,
                    body: this.newPost.body,
                });
                this.newPost.body = "";
            } catch (error) { 
                //TODO: manejar casos de erroes 
            }
        },
    },
    async mounted() {
        listenForPost(
        async receivedPost => {
                this.posts.push(receivedPost);
            
                await nextTick();
                this.$refs.postContainer.scrollTop = this.$refs.postContainer.scrollHeight;  
            }
        );

        try {
            this.posts = await getLastPosts();

            await nextTick();

            this.$refs.postContainer.scrollTop = this.$refs.postContainer.scrollHeight; 
        } catch (error){
            //TODO...
        }
    }
    
}
</script>

<template>
    <MainH1>Posts</MainH1>

    <div class="md:flex gap-4">
        <div 
            ref="postContainer"
            class=" overflow-y-auto md:w-9/12 h-100 p-4 mb-4 md:mb-0 border border-gray-400 rounded"
        >
            <h2 class="sr-only">Lista de mensajes</h2>

            <ol class="flex flex-col gap-4">
                <li v-for="post in posts" class="flex flex-col gap-0.5">
                    <div>
                        <b>{{ post.email }}</b> dijo:
                    </div>
                    <div>{{ post.body }}</div>
                    <div class="text-sm text-gray-500">{{ post.created_at }}</div>
                </li>
            </ol>
        </div>
        <div class="md:w-3/12">
            <h2 class="mb-4 text-2xl">Publicar un post</h2>
            <form action="#" @submit.prevent="() => sendPost()">
                <div class="mb-4">
                    <label for="email" class="block mb-2">Email</label>
                    <input v-model="newPost.email" type="email" id="email"
                        class="w-full p-2 border borer-gray-400 rounded" />
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">post</label>
                    <textarea v-model="newPost.body" id="body"
                        class="w-full p-2 border borer-gray-400 rounded"></textarea>
                </div>
                <button type="submit"
                    class="transition-colors cursor-pointer py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">
                    Enviar
                </button>
            </form>
        </div>
    </div>
</template>
