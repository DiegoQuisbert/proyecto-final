import supabase from "./supabase";

/**
 * Subimos un post
 * 
 * @param {{email: string, body: string}} data 
 */

export async function savePost(data){
    const { error } = await supabase
        .from('post')
        .insert({
            ...data
        });

    if(error) {
        console.error('[posts.js savePost] Error al grabar el post: ', error);
        throw error; 
    }
}

/**
 * Obtenemos los últimos posts publicados
 * 
 * @returns {Promise<{id: number, email: string, body: string, created_at: string}[]>}
 */

export async function getLastPosts() {
    const {data, error} = await supabase
    .from('post')
    .select();

    if(error){
        console.error('[posts.js getLastPosts] Error al obtener los posts: ', error);
        throw error; 
    }

    return data;
}

/**
 * Escucha en tiempo real de la publicación de nuevos posts
 * 
 * @param {(post: object) => void} callback 
 */

export async function listenForPost (callback){
    const postChannel = supabase.channel('post');
    
    postChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'post',
        },
        data => {
            callback(data.new);
        }
    );

    postChannel.subscribe();
}

/**
 * Obtenemos el post por su id
 * 
 * @param {number} id 
 * @returns 
 */
export async function getPostById(id) {
    const {data, error} = await supabase
    .from('post')
    .select('*')
    .eq('id', id)
    .single()

    if(error){
        console.error('[posts.js getPostById] Error al obtener la id del post: ', error);
        throw error;
    }
    return data;
}

/**
 * Obtenemos los posts de un usuario por su id
 * 
 * @param {string} userId 
 * @returns 
 */
export async function getPostsByUserId(userId) {
    const { data, error } = await supabase
        .from('post')
        .select()
        .eq('sender_id', userId);

    if (error) {
        console.error('[posts.js getPostsByUserId] Error al obtener los posts del usuario: ', error);
        throw error;
    }
    return data;
}

/**
 * Eliminamos un post por su id
 * 
 * @param {*} id 
 * @returns
 */
export async function handleDeletePost(id) {
    const { error } = await supabase
        .from('post')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[posts.js handleDeletePost] Error al eliminar el post: ', error);
        throw error;
    }
}

/**
 * Editamos un post
 * 
 * @param {*} id 
 * @param {object} updatedData 
 * @returns
 */
export async function EditPost(id, updatedData) {
    const { error } = await supabase
        .from('post')
        .update(updatedData)
        .eq('id', id);

    if (error) {
        console.error('[posts.js EditPost] Error al Actualizar el post: ', error);
        throw error;
    }
}

/**
 * Subimos una respuesta a un post
 * 
 * @param {object} data
 * @returns 
 */
export async function saveReply(data) {
    const {error} = await supabase
    .from('post_replies')
    .insert({
        ...data
    });

    if(error) {
        console.error('[posts.js saveReply] Error al grabar la respuesta: ', error);
        throw error; 
    }
}

/**
 * Obtenemos Las respuestas a un post por su id
 * 
 * @param {number} postId 
 * @returns 
 */
export async function getRepliesByPostId(postId) {
    const {data, error} = await supabase
    .from('post_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

    if(error) {
        console.error('[posts.js getRepliesByPostId] Error al obtener las respuestas del usuario: ', error);
        throw error; 
    }
    
    return data;
}

/**
 * Obtenemos las respuestas en posts de un usuario en específico
 * 
 * @param {number} senderId 
 * @returns 
 */
export async function getRepliesBySenderId(senderId) {
    const { data, error } = await supabase
        .from('post_replies')
        .select('*')
        .eq('sender_id', senderId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[posts.js getRepliesBySenderId] Error al obtener respuestas del usuario: ', error);
        throw error;
    }

    return data;
}

/**
 * Eliminamos la respuesta a un post
 * 
 * @param {number} id 
 * @returns
 */
export async function handleDeleteReply(id) {
    const { error } = await supabase
        .from('post_replies')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[posts.js handleDeleteReply] Error al eliminar la respuesta: ', error);
        throw error;
    }
}

/**
 * 
 * @param {number} id 
 * @param {object} updatedData 
 * @returns
 */
export async function EditReply(id, updatedData) {
    const { error } = await supabase
        .from('post_replies')
        .update(updatedData)
        .eq('id', id);

    if (error) {
        console.error('[posts.js EditReplies] Error al Actualizar la respuesta: ', error);
        throw error;
    }
}