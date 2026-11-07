import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { updateCurrentUserAvatar } from '../services/auth';

export default function useProfileEditAvatar() {
    const router = useRouter();
    const avatar = ref({ file: null, preview: null });
    const editing = ref(false);
    const error = ref(null);

    function clearPreview() {
        if (avatar.value.preview) {
            URL.revokeObjectURL(avatar.value.preview);
        }
        avatar.value = { file: null, preview: null };
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        clearPreview();

        if (selectedFile) {
            avatar.value = {
                file: selectedFile,
                preview: URL.createObjectURL(selectedFile),
            };
        }
    }

    async function handleSubmit() {
        error.value = null;

        if (!avatar.value.file) {
            error.value = 'Seleccioná una imagen para actualizar.';
            return;
        }

        try {
            editing.value = true;
            await updateCurrentUserAvatar(avatar.value.file);
            router.push('/mi-perfil');
        } catch (requestError) {
            console.error('[useProfileEditAvatar] Error al actualizar el avatar:', requestError);
            error.value = 'No se pudo actualizar la foto de perfil. Intentá nuevamente.';
        } finally {
            editing.value = false;
        }
    }

    onUnmounted(clearPreview);

    return {
        avatar,
        editing,
        error,
        handleFileChange,
        handleSubmit,
    };
}
