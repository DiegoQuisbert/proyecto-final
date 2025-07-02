import supabase from "./supabase";

/**
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

export async function getRepliesByPostId(postId) {
    const {data, error} = await supabase
    .from('post_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', {ascending: true});

    if(error) {
        console.error('[posts.js getRepliesByPostId] Error al obtener la id de la respuesta: ', error);
        throw error; 
    }
    
    return data;
}

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

// const postChannel = supabase.channel("post", {
//     config: {
//         broadcast: {
//             self: true,
//         },
//     }
// });

// export async function savePost(data) {
//     return postChannel.send({
//         type: 'broadcast',
//         event: 'new-post',
//         payload: {...data},
//     });
// }

// export async function listenForPost(callback) {
//     postChannel.on(
//     'broadcast',
//     {
//         event: 'new-post',
//     },
//     (data) => {
//         console.log("la data recibida fue: ", data);

//         callback(data.payload);
//     }
// );

//     postChannel.subscribe();
// }
