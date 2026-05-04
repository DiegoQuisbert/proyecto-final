import { ref, onMounted } from 'vue';
import { updateCurrentUserProfile } from '../services/auth';
import useGlobalFeedback from './useGlobalFeedback';

export default function useProfileEdit(user) {
    const profile = ref({
        bio: '',
        pronouns: '',
        location: '',
        display_name: '',
    });
    const editing = ref(false);
    const { updateFeedback } = useGlobalFeedback();

    // Inicializar con datos del usuario
    onMounted(() => {
        profile.value = {
            bio: user.value.bio || '',
            display_name: user.value.display_name || '',
            pronouns: user.value.pronouns || '',
            location: user.value.location || '',
        };
    });

    // Submit del formulario
    const handleSubmit = async () => {
        updateFeedback({ message: null });

        try {
            editing.value = true;
            await updateCurrentUserProfile({
                ...profile.value,
            });

            updateFeedback({
                message: 'La información de perfil se actualizó con éxito',
                type: 'success',
            });
        } catch (err) {
            updateFeedback({
                message: 'Ocurrió un error inesperado al tratar de actualizar la información de perfil',
                type: 'error',
            });
        } finally {
            editing.value = false;
        }
    };

    return {
        profile,
        editing,
        handleSubmit,
    };
}