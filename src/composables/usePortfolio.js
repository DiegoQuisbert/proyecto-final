import { ref, onMounted } from 'vue';
import { getPortfolioByUserId, savePortfolio, deletePortfolioItem } from '../services/portfolio';
import { uploadFile, getFileUrl, deleteFile } from '../services/storage';
import useGlobalFeedback from './useGlobalFeedback';

export default function usePortfolio() {
    const portfolios = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const { updateFeedback } = useGlobalFeedback();

    // Fetch portfolios de un usuario
    const fetchPortfolios = async (userId) => {
        loading.value = true;
        try {
            const rawPortfolios = await getPortfolioByUserId(userId);
            portfolios.value = rawPortfolios.map(p => ({
                ...p,
                mediaUrl: p.media ? getFileUrl(`portfolio/${p.media}`, 'user-portfolio') : null
            }));
        } catch (err) {
            error.value = err.message || 'Error al cargar portfolios';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Subir un nuevo portfolio
    const submitPortfolio = async (userId, formData) => {
        const { title, body, file } = formData;
        if (!title.trim() || !body.trim()) return;

        updateFeedback({ message: null });

        try {
            let fileName = null;
            if (file) {
                fileName = `${Date.now()}-${file.name}`;
                await uploadFile(`portfolio/${fileName}`, file, 'user-portfolio');
            }

            await savePortfolio({
                sender_id: userId,
                title: title.trim(),
                body: body.trim(),
                media: fileName
            });

            await fetchPortfolios(userId); // Refrescar lista

            updateFeedback({
                message: 'Portfolio subido correctamente.',
                type: 'success'
            });
        } catch (err) {
            console.error(err);
            updateFeedback({
                message: 'Ocurrió un error al subir el portfolio.',
                type: 'error'
            });
        }
    };

    // Eliminar un portfolio
    const deletePortfolio = async (id) => {
        try {
            await deletePortfolioItem(id);
            portfolios.value = portfolios.value.filter(p => p.id !== id);
        } catch (err) {
            error.value = err.message || 'Error al eliminar portfolio';
            console.error(err);
        }
    };

    return {
        portfolios,
        loading,
        error,
        fetchPortfolios,
        submitPortfolio,
        deletePortfolio,
    };
}