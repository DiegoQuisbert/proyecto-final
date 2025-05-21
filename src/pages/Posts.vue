<script>
import { nextTick } from "vue";
import MainH1 from "../components/MainH1.vue";
import MainLoader from "../components/MainLoader.vue";
import MainLabel from "../components/MainLabel.vue";
import { getLastPosts, listenForPost, savePost } from "../services/posts";
import { subscribeToAuthUserChanges } from "../services/auth";
import { RouterLink } from "vue-router";

export default {
    name: "Post",
    components: { MainH1, MainLoader, MainLabel },

    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
            },

            posts: [],
            loadingPost: false,
            
            newPost: {
                body: '',
            },
        };
    },
    methods: {
        async sendPost() {
            try {
                savePost({
                    sender_id: this.user.id,
                    email: this.user.email,
                    body: this.newPost.body,
                });
                this.newPost.body = '';
            } catch (error) { 
                //TODO: manejar casos de erroes 
            }
        },
    },
    async mounted() {
        subscribeToAuthUserChanges(newUserState => this.user = newUserState)

        listenForPost(
        async receivedPost => {
                this.posts.push(receivedPost);
            
                await nextTick();
                this.$refs.postContainer.scrollTop = this.$refs.postContainer.scrollHeight;  
            }
        );

        try {
            this.loadingPost = true;
            this.posts = await getLastPosts();
            this.loadingPost = false;

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

            <ol 
                v-if="!loadingPost"
                class="flex flex-col gap-4">
                <li 
                    v-for="post in posts" 
                    class="flex flex-col gap-0.5"
                >
                    <div>
                        <RouterLink
                            :to="`/usuario/${post.sender_id}`"
                            class="text-blue-700 font-bold underline"
                        >{{ post.email }}</RouterLink>
                        dijo:
                    </div>
                    <div>{{ post.body }}</div>
                    <div class="text-sm text-gray-500">{{ post.created_at }}</div>
                </li>
            </ol>
            <MainLoader v-else />
        </div>
        <div class="md:w-3/12">
            <h2 class="mb-4 text-2xl">Publicar un post</h2>
            <form 
                action="#" 
                @submit.prevent="() => sendPost()"
            >
                <div class="mb-4">
                    <span class="block mb-2">Email:</span>
                    <div class="font-bold">{{ user.email }}</div>
                </div>
                <div class="mb-4">
                    <MainLabel for="body">post:</MainLabel>
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
