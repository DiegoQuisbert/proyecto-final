import supabase from "./supabase";

/**
 * 
 * @param {{id: string, email: string}} data 
 */

export async function createUserProfile(data) {
    const {error} = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profiles.js getUserProfile] Error al crear el perfil de usuario: ', error);
        throw error;
    }
}


/**
 * 
 * @param {string} id 
 * @param {{bio?: string|null, display_name?: string|null}} data 
 */
export async function updateUserProfile(id, data) {
    const {error} = await supabase
    .from('user_profiles')
    .update(data)
    .eq('id', id);

    if(error) {
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil de usuario: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} id 
 */

export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);

    if(error) {
        console.error('[user-profiles.js getUserProfileById] Error al obtener el perfil de usuario: ', error);
        throw error;
    }

    return data[0];
}