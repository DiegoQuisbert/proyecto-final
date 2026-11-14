//Se debe re-trabajar las rutas, especialmente con las partes para perfiles

import { createRouter, createWebHistory } from "vue-router";
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
/* import Confirmation from "../pages/Confirmation.vue"; */

import supabase from "../services/supabase";

const routes = [
    {path: '/',                        component: Home,     },
    {path: '/iniciar-sesion',          component: Login,    },
    {path: '/crear-cuenta',            component: Register, },
    {path: '/posts',                   component: Posts,               meta: { requiresAuth: true,  }, },
    {path: '/posts/:id',               component: Post,                meta: { requiresAuth: true,  }, },
    {path: '/posts/:id/editar',        component: PostEdit,            meta: { requiresAuth: true,  }, },
    /* {path: '/posts/:id/confirmación',  component: Configuration,       meta: { requiresAuth: true,  }, }, */
    {path: '/mi-perfil',               component: MyProfile,           meta: { requiresAuth: true,  }, },
    {path: '/mi-perfil/multimedia',    component: MyProfileMultimedia, meta: { requiresAuth: true,  }, },
    {path: '/mi-perfil/portfolio',     component: MyProfilePortFolio,  meta: { requiresAuth: true,  }, },
    {path: '/mi-perfil/respuestas',    component: MyProfileReplies,    meta: { requiresAuth: true,  }, },
    {path: '/mi-perfil/editar',        component: MyProfileEdit,       meta: { requiresAuth: true,  }, },
    {path: '/mi-perfil/editar/avatar', component: MyProfileEditAvatar, meta: { requiresAuth: true,  }, },
    {path: '/perfil/:id',              component: UserProfile, meta: { requiresAuth: true }, children: [
        { path: '', component: () => import('../pages/UserProfilePosts.vue') },
        { path: 'portfolio', component: () => import('../pages/UserProfilePortfolio.vue') },
        { path: 'multimedia', component: () => import('../pages/UserProfileMultimedia.vue') },
        { path: 'respuestas', component: () => import('../pages/UserProfileReplies.vue') }
    ]},
    {path: '/notificaciones',          component: Notifications,       meta: { requiresAuth: true,  }, },
    {path: '/mensajes',                component: PrivateChatList,     meta: { requiresAuth: true,  }, },
    {path: '/mensajes/:id/chat',       component: PrivateChats,        meta: { requiresAuth: true,  }, },
    {path: '/guardados',               component: Bookmarks,           meta: { requiresAuth: true,  }, },
    {path: '/configuraciones',         component: Configuration,       meta: { requiresAuth: true,  }, },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) {
        return true;
    }

    try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            return '/iniciar-sesion';
        }
    } catch (error) {
        console.error('[router beforeEach] Error al validar la sesión:', error);
        return '/iniciar-sesion';
    }

    return true;
});

export default router;