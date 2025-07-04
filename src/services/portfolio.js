import supabase from "./supabase";

/**
 * Subimos el portfolio a la tabla de supabase
 * 
 * @param {{sender_id: string, title: string, body: string, image?: string}} data
 * @returns
 */
export async function savePortfolio(data){
    const { error } = await supabase
        .from('portfolio')
        .insert([
            ...data
        ]);

    if(error){
        console.error('[portfolio.js savePortfolio] Error al subir el portfolio: ', error);
        throw error;
    }
}

/**
 * Obtiene el portfolio del usuario por su id
 * 
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
export async function getPortfolioByUserId(userId) {
    const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('sender_id', userId);

    if (error) {
        console.error('[portfolio.js getPortfolioByUserId] Error al obtener el portfolio del usuario: ', error);
        throw error;
    }

    return data;
}

/**
 * Editamos una entrada del portfolio
 * 
 * @param {number} id 
 * @param {{ title?: string, body?: string, media_url?: string }} updatedData 
 * @returns {Promise<void>}
 */
export async function EditPortfolio(id, updatedData) {
    const { error } = await supabase
        .from('portfolio')
        .update(updatedData)
        .eq('id', id);

    if (error) {
        console.error('[posts.js EditPost] Error al Actualizar el portfolio: ', error);
        throw error;
    }
}

/**
 * Eliminamos una entrada del portfolio
 * 
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deletePortfolioItem(id) {
    const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[portfolio.js deletePortfolioItem] Error al borrar el portfolio del usuario: ', error);
        throw error;
    }
}