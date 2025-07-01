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

export default function useGlobalFeedback() {
    return {
        feedback,
        updateFeedback,
        clearFeedback,
    };
}
