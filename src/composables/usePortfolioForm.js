import { onUnmounted, ref } from 'vue';

const emptyPortfolioForm = () => ({
    title: '',
    body: '',
    file: null,
    preview: null,
});

export default function usePortfolioForm(user, submitPortfolio) {
    const portfolioForm = ref(emptyPortfolioForm());

    function resetPortfolioForm() {
        if (portfolioForm.value.preview) {
            URL.revokeObjectURL(portfolioForm.value.preview);
        }
        portfolioForm.value = emptyPortfolioForm();
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            resetPortfolioForm();
            return;
        }

        if (portfolioForm.value.preview) {
            URL.revokeObjectURL(portfolioForm.value.preview);
        }
        portfolioForm.value.file = selectedFile;
        portfolioForm.value.preview = URL.createObjectURL(selectedFile);
    }

    async function handleSubmitPortfolio() {
        await submitPortfolio(user.value.id, portfolioForm.value);
        resetPortfolioForm();
    }

    onUnmounted(() => {
        if (portfolioForm.value.preview) {
            URL.revokeObjectURL(portfolioForm.value.preview);
        }
    });

    return {
        portfolioForm,
        handleFileChange,
        handleSubmitPortfolio,
    };
}
