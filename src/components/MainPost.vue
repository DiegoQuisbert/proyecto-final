<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'MainPost',
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    components: {
        RouterLink
    }
};
</script>

<template>
    <RouterLink :to="`/posts/${post.id}`">
        <li class="border border-gray-300 rounded p-4 shadow bg-white">
            <div class="mb-2">
                <RouterLink 
                    :to="`/usuario/${post.sender_id}`" 
                    class="text-blue-700 hover:underline"
                    >                   
                    <b class="text-gray-700">{{ post.display_name }} ||</b> {{ post.email }}
                </RouterLink>
                <span class="text-gray-500 text-sm ml-2">{{ post.created_at }}</span>
            </div>
            <div>{{ post.body }}</div>
        </li>
    </RouterLink>
</template>