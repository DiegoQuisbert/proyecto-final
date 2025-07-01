import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthUserChanges } from "../services/auth";

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Posts from '../pages/Posts.vue';
import Post from "../pages/Post.vue";
import MyProfile from "../pages/MyProfileHome.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateChats from "../pages/PrivateChats.vue";
import MyProfileEditAvatar from "../pages/MyProfileEditAvatar.vue";
import MyProfileMultimedia from "../pages/MyProfileMultimedia.vue";
import MyProfilePortFolio from "../pages/MyProfilePortFolio.vue";
import MyProfileReplies from "../pages/MyProfileReplies.vue";
import Notifications from "../pages/Notifications.vue";
import PrivateChatList from "../pages/PrivateChatList.vue";
import Bookmarks from "../pages/Bookmarks.vue";
import Configuration from "../pages/Configuration.vue";
import PostEdit from "../pages/PostEdit.vue";

const routes = [
    {path: '/',                        component: Home,},
    {path: '/iniciar-sesion',          component: Login,},
    {path: '/crear-cuenta',            component: Register,},
    {path: '/posts',                   component: Posts,               meta: { requiresAuth: true, }, },
    {path: '/posts/:id',               component: Post,                meta: { requiresAuth: true, }, },
    {path: '/posts/:id/editar',        component: PostEdit,            meta: { requiresAuth: true, }, },
    {path: '/mi-perfil',               component: MyProfile,           meta: { requiresAuth: true, }, },
    {path: '/mi-perfil/multimedia',    component: MyProfileMultimedia, meta: { requiresAuth: true, }, },
    {path: '/mi-perfil/portfolio',     component: MyProfilePortFolio,  meta: { requiresAuth: true, }, },
    {path: '/mi-perfil/respuestas',    component: MyProfileReplies,    meta: { requiresAuth: true, }, },
    {path: '/mi-perfil/editar',        component: MyProfileEdit,       meta: { requiresAuth: true, }, },
    {path: '/mi-perfil/editar/avatar', component: MyProfileEditAvatar, meta: { requiresAuth: true, }, },
    {path: '/usuario/:id',             component: UserProfile,         meta: { requiresAuth: false, }, },
    {path: '/notificaciones',          component: Notifications,       meta: { requiresAuth: true, }, },
    {path: '/mensajes',                component: PrivateChatList,     meta: { requiresAuth: true, }, },
    {path: '/mensajes/:id/chat',        component: PrivateChats,       meta: { requiresAuth: true, }, },
    {path: '/guardados',               component: Bookmarks,           meta: { requiresAuth: true, }, },
    {path: '/configuraciones',         component: Configuration,       meta: { requiresAuth: true, }, },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

let user = {
    id: null,
    email: null,
}

subscribeToAuthUserChanges(newUserdata => user = newUserdata);

router.beforeEach((to) => {
    if(to.meta.requiresAuth && user.id === null) {
        return '/iniciar-sesion';
    }
});

export default router;