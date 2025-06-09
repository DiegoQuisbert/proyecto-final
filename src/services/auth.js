import supabase from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";

let user = {
    id: null,
    email: null,
    bio: null,
    display_name: null,
    pronoums: null,
}

let observers = [];

getCurrentAuthUser();

if(localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
}

async function getCurrentAuthUser() {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            // console.error('[auth.js getCurrentAuthUser] Error al obtener al usuario autenticado: ', error);
            return;
        }

        updateUser({
            id: data.user.id,
            email: data.user.email,
        });

        fetchCurrentUserExtendedProfile();

        return data.user;
    } catch (error) {
        console.error('[auth.js getCurrentAuthUser] Error al obtener al usuario: ', error);
    }
}

/**
 * Carga los atos el perfil autenticado
 */

async function fetchCurrentUserExtendedProfile() {
    try {
        const profile = await getUserProfileById(user.id); 
    
    updateUser({
        bio: profile.bio,
        display_name: profile.display_name, 
        pronoums: profile.pronoums,
    });

        // user = {
        //     ...user,
        //     bio: profile.bio,
        //     display_name: profile.display_name,
        // }
        // notifyAll();
    } catch (error){
        //TODO...
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */

export async function register(email, password) {
    const {data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js register] Error al registrar al usuario: ', error);
        throw error;
    }

    try {
        await createUserProfile({
            id: data.user.id,
            email,
        });
    } catch (error) {
        //TODO...
    }

    // console.log('Usuario registrado y autenticado !', data);

    updateUser({
        id: data.user.id, 
        email: data.user.email,
    });

    // user = {
    //     ...user,
    //     id: data.user.id,
    //     email: data.user.email,
    // }
    // notifyAll();

    return data.user;
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw error;
    }

    updateUser({
        id: data.user.id, 
        email: data.user.email,
    });

    // user = {
    //     ...user,
    //     id: data.user.id,
    //     email: data.user.email,
    // }
    // notifyAll();

    fetchCurrentUserExtendedProfile();

    return data.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if(error) {
        console.error('[auth.js logout] Error al cerrar sesión: ', error);
        throw error;
    }
    updateUser({
        id: null, 
        email: null,
        bio: null,
        display_name: null,
        pronoums: null,
    });
    // user = {
    //     ...user,
    //     id: null,
    //     email: null,
    // }
    // notifyAll();
}

/**
 * @param {{bio?: string|null, display_name?: string|null}} data
 */
export async function updateCurrentUserProfile(data) {
    try {
        await updateUserProfile(user.id, data);
    } catch (error){
        throw error;
    }

    updateUser({...data});
}

/**
 * Registra un observer para recibir los cambios del estado del usuario autenticado.
 * Este observer debe ser una función que va a recibir como parámetro los datos del usuario.
 * 
 * @param {() => {}} callback 
 */

export function subscribeToAuthUserChanges(callback) {
    observers.push(callback);

    notify(callback);
}

/**
 * Notifica al observer.
 * Ejecuta el callback y le pasa una copia de los datos del usuario.
 * @param {() => {}} callback 
 */

function notify(callback) {
    callback({...user});
}

/**
 * Notifica a todos los observers del estado del usuario    
 */

function notifyAll() {  
    observers.forEach(callback => notify(callback));
}

/**
 * 
 * @param {{id?: string/null, email?: string/null, display_name?: string/null, bio?:string/null}} data 
 */

function updateUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll();

    if(user.id) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}