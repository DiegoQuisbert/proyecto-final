import supabase from "./supabase";

/**
 * Subimos un archivo en el bucket de avatars
 * 
 * @param {File} name 
 * @param {string} file 
 * @param {string} bucket 
 */


export async function uploadFile(name, file, bucket = 'avatars'){
    const { error } = await supabase
        .storage
        .from(bucket)
        .upload(name, file);

    if(error){
        console.error('[storage.js uploadFile] Error al subir el archivo: ', error);
        throw error;
    }
}

/**
 * Obtenemos la url del archivo del bucket de avatars
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string}
 */

export function getFileUrl(filename, bucket = 'avatars') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return data.publicUrl;
}

/**
 * Borramos un archivo del bucket de avatars (No se termina de probar del todo, fata revisar las policies de supabase)
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket = 'avatars') {
    const { error } = await supabase
        .storage
        .from(bucket)
        .remove([filename]);

    if (error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo: ', error);
        throw error;
    }
}