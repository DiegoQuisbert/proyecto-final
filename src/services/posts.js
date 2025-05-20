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
 * @returns {Promise<{id: number, email: string, body: string, created_at: stirng}[]>}
 */

export async function getLastPosts() {
    const {data, error} = await supabase
    .from('post')
    .select();

    if(error){
        console.error('[posts.js savePost] Error al obtener los posts: ', error);
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
            console.log("[posts.js savePost] El evento recibido es: ", data);

            callback(data.new);
        }
    );

    postChannel.subscribe();
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
