import { onUnmounted, ref } from 'vue';
import { savePost } from '../services/posts';
import { uploadFile } from '../services/storage';

export default function usePostForm(user) {
    const newPost = ref({ body: '' });
    const imageFile = ref({ file: null, preview: null });

    const loading = ref(false); // <--- Add this

    function clearImageFile() {
        if (imageFile.value.preview) {
            URL.revokeObjectURL(imageFile.value.preview);
        }
        imageFile.value = { file: null, preview: null };
    }

    function handleFileChange(event) {
        const selected = event.target.files[0];
        clearImageFile();

        if (selected) {
            imageFile.value = {
                file: selected,
                preview: URL.createObjectURL(selected),
            };
        }
    }

    async function sendPost() {
        if (!newPost.value.body.trim()) return;
        
        loading.value = true; // <--- Bloquear botón

        try {
            let fileName = null;
            if (imageFile.value.file) {
                fileName = `${Date.now()}-${imageFile.value.file.name}`;
                await uploadFile(`post/${fileName}`, imageFile.value.file, 'post-multimedia');
            }

            await savePost({
                sender_id: user.value.id,
                email: user.value.email,
                body: newPost.value.body,
                multimedia: fileName,
            });

            newPost.value.body = '';
            clearImageFile();
        } catch (error) {
            console.error('Error al subir el post:', error);
        } finally {
            loading.value = false; // <--- Desbloquear
        }
    }

    onUnmounted(clearImageFile);

    return {
        newPost,
        imageFile,
        handleFileChange,
        sendPost,
        loading, // <--- Retornar loading
    };
}
