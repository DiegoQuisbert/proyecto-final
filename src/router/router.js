import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthUserChanges } from "../services/auth";

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Posts from '../pages/Posts.vue';
import MyProfile from "../pages/MyProfile.vue";

const routes = [
    {path: '/',                 component: Home,},
    {path: '/iniciar-sesion',   component: Login,},
    {path: '/crear-cuenta',     component: Register,},
    {path: '/posts',            component: Posts,       meta: { requiresAuth: true, }, },
    {path: '/mi-perfil',        component: MyProfile,   meta: { requiresAuth: true, }, },
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