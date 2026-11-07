import { ref } from "vue";

const feedback = ref({
    message: null,
    type: "success",
});

function updateFeedback(newFeedback) {
    feedback.value = {
        ...feedback.value,
        ...newFeedback,
    };
}

function clearFeedback() {
    feedback.value = {
        message: null,
        type: "success",
    };
}

function restoreFeedback() {
    const saved = localStorage.getItem('feedback');
    if (!saved) return;

    try {
        const savedFeedback = JSON.parse(saved);
        if (typeof savedFeedback?.message !== 'string' || typeof savedFeedback?.type !== 'string') {
            throw new Error('El feedback guardado tiene un formato inválido.');
        }

        updateFeedback(savedFeedback);
    } catch (error) {
        console.error('[useGlobalFeedback] Error al restaurar el feedback:', error);
        localStorage.removeItem('feedback');
        clearFeedback();
    }
}

export default function useGlobalFeedback() {
    return {
        feedback,
        updateFeedback,
        clearFeedback,
        restoreFeedback,
    };
}
