import supabase from "./supabase";

const privateChatIdsCache = new Map();

/**
 * Traemos el chat privado
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number|null>}
 */
async function fetchPrivateChat(sender_id, receiver_id){
    const userIds = [sender_id, receiver_id].sort();

    const { data, error } = await supabase
    .from('private_chats')
    .select('id')
    .eq('user_id1', userIds[0])
    .eq('user_id2', userIds[1]);

    if(error) {
        console.error('[private-chat.js fetchPrivateChat] Error al traer el chat privado: ', error);
        throw error;
    }

    return data[0]?.id;
}

/**
 * Creamos el chat privado
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns 
 */
async function createPrivateChat(sender_id, receiver_id) {
    const userIds = [sender_id, receiver_id].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userIds[0],
            user_id2: userIds[1],
        })
        .select();

        if(error) {
            console.error('[private-chat.js createPrivateChat] Error al crear mensaje del chat privado: ', error);
            throw error;
    }

    return data[0].id;
}

/**
 * Obtenemos la id del chat privado
 * 
 * @param {*} sender_id 
 * @param {*} receiver_id 
 * @returns
 */
export async function getPrivateChatId(sender_id, receiver_id){
    const cacheKey = [sender_id, receiver_id].sort().join('_');
    if(privateChatIdsCache.has(cacheKey)) {
        return privateChatIdsCache.get(cacheKey);
    }

    let chat_id = await fetchPrivateChat(sender_id, receiver_id);

    if(!chat_id) {
        chat_id = await createPrivateChat(sender_id, receiver_id);
    }

    privateChatIdsCache.set(cacheKey, chat_id);

    return chat_id;
}

/**
 * Mandamos un mensaje
 * 
 * @param {*} sender_id 
 * @param {*} receiver_id 
 * @param {*} body 
 */

export async function savePrivateChatMessage(sender_id, receiver_id, body) {
    const chat_id = await getPrivateChatId(sender_id, receiver_id);

    const { error } = await supabase
        .from('private_messages')
        .insert({
            chat_id,
            sender_id,
            body,
        });

    if (error) {
        console.error('[private-chat.js savePrivateChatMessage] Error al mandar un mensaje del chat privado: ', error);
        throw error;
    }
}

/**
 * Escuchamos o mostramos el mensaje
 * 
 * @param {*} sender_id 
 * @param {*} receiver_id 
 * @param {() => void} callback 
 */

export async function listenForPrivateChatMessages(sender_id, receiver_id, callback){
    const chat_id = await getPrivateChatId(sender_id, receiver_id);

    const privateChatChannel = supabase.channel('private-chat');
    privateChatChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages',
            filter: 'chat_id=eq.' + chat_id,
        },
        data => {
            callback(data.new);
        }
    );
    privateChatChannel.subscribe();

    return () => privateChatChannel.unsubscribe();
}

/**
 * Mostramos los mensajes del chat
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<{}[]>}
 */

export async function getPrivateChatLastMessages(sender_id, receiver_id) {
    const chat_id = await getPrivateChatId(sender_id, receiver_id);

    const { data, error } = await supabase
        .from('private_messages')
        .select()
        .eq('chat_id', chat_id);

    if(error){
        console.error('[private-chat.js getPrivateChatLastMessages] Error al traer los últimos mensajes del chat privado: ', error);
        throw error;
    }

    return data;
}