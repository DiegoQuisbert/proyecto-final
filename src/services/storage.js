import supabase from "./supabase";

/**
 * Subimos un archivo en el bucket de avatars
 * 
 * @param {File} path 
 * @param {string} file 
 * @param {string} bucket 
 */


export async function uploadFile(path, file, bucket){

    if(!bucket) {
        throw new Error("[storage.js uploadFile] Especificar el bucket por favor");
    }

    const { error } = await supabase
        .storage
        .from(bucket)
        .upload(path, file);

    if(error){
        console.error(`[storage.js uploadFile] Error al subir el archivo a ${bucket}: `, error);
        throw error;
    }
}

/**
 * Obtenemos la url del archivo del bucket de avatars
 * 
 * @param {string} path 
 * @param {string} bucket 
 * @returns {string}
 */

export function getFileUrl(path, bucket) {
    if(!bucket) {
        throw new Error("[storage.js getFileUrl] Especificar el bucket por favor")
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Borramos un archivo del bucket de avatars (No se termina de probar del todo, fata revisar las policies de supabase)
 * 
 * @param {string} path 
 * @param {string} bucket 
 */
export async function deleteFile(path, bucket) {
    if (!bucket) {
        throw new Error("[storage.js deleteFile] Especificar el bucket por favor")
    }

    const { error } = await supabase
        .storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo: ', error);
        throw error;
    }
}