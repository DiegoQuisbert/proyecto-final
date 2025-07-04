import { uploadFile } from "./storage";
import supabase from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";

let user = {
    id: null,
    email: null,
    bio: null,
    display_name: null,
    pronouns: null,
    location: null,
    avatar: null,
}

let observers = [];

getCurrentAuthUser();

if(localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
}

/**
 * 
 * @returns
 */
async function getCurrentAuthUser() {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            return;
        }

        updateUser({
            id: data.user.id,
            email: data.user.email,
            display_name: data.user.display_name,
        });

        fetchCurrentUserExtendedProfile();

        return data.user;
    } catch (error) {
        console.error('[auth.js getCurrentAuthUser] Error al obtener al usuario: ', error);
    }
}

/**
 * @returns
 */

async function fetchCurrentUserExtendedProfile() {
    try {
        const profile = await getUserProfileById(user.id); 
    
    updateUser({
        bio: profile.bio,
        display_name: profile.display_name, 
        pronouns: profile.pronouns,
        location: profile.location,
        avatar: profile.avatar,
    });
    } catch (error){
        //TODO...
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} display_name
 * @returns 
 */

export async function register(email, password, display_name) {
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
            display_name,
        });
    } catch (error) {
        //TODO...
    }

    updateUser({
        id: data.user.id, 
        email: data.user.email,
        display_name,
    });

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
        throw error;
    }

    updateUser({
        id: data.user.id, 
        email: data.user.email,
    });

    fetchCurrentUserExtendedProfile();

    return data.user;
}

/**
 * @returns
 */
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
        pronouns: null,
        location: null,
        avatar: null,
    });
}

/**
 * @param {{bio?: string|null, display_name?: string|null, pronouns?: string|null, location?: string|null, avatar?: string|null}} data
 */
export async function updateCurrentUserProfile(data) {
    try {
        await updateUserProfile(user.id, data);
        updateUser(data);
    } catch (error){
        throw error;
    }

    updateUser({...data});
}

/**
 * 
 * @param {file} file 
 */

export async function updateCurrentUserAvatar(file) {
    try {
        const photoName = `${user.id}/${crypto.randomUUID()}.jpg`;

        await uploadFile(photoName, file, 'avatars');

        await updateCurrentUserProfile({avatar: photoName});
    } catch (error) {
        //TODO...
    }
}

/**
 * Registra un observer para recibir los cambios del estado del usuario autenticado.
 * Este observer debe ser una función que va a recibir como parámetro los datos del usuario.
 * 
 * @param {() => {}} callback 
 * @returns {() => void}
 */

export function subscribeToAuthUserChanges(callback) {
    
    observers.push(callback);

    notify(callback);

    return () => {
        observers = observers.filter(obs => obs != callback);
    }
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
 * @param {{id?: string|null, email?: string|null, display_name?: string|null, bio?:string|null, pronouns?:string|null, location?:string|null, avatar?:string|null}} data 
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