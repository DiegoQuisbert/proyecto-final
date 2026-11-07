import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGlobalFeedback from './useGlobalFeedback';

let storedFeedback;

beforeEach(() => {
    storedFeedback = null;
    vi.stubGlobal('localStorage', {
        getItem: vi.fn(() => storedFeedback),
        removeItem: vi.fn(() => {
            storedFeedback = null;
        }),
    });
    useGlobalFeedback().clearFeedback();
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('useGlobalFeedback', () => {
    it('restores saved feedback into the shared state', () => {
        storedFeedback = JSON.stringify({ message: 'Guardado', type: 'success' });
        const { feedback, restoreFeedback } = useGlobalFeedback();

        restoreFeedback();

        expect(feedback.value).toEqual({ message: 'Guardado', type: 'success' });
    });

    it('clears malformed persisted feedback without throwing', () => {
        storedFeedback = '{invalid';
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { feedback, restoreFeedback } = useGlobalFeedback();

        expect(() => restoreFeedback()).not.toThrow();

        expect(feedback.value).toEqual({ message: null, type: 'success' });
        expect(localStorage.removeItem).toHaveBeenCalledWith('feedback');
        expect(consoleError).toHaveBeenCalledOnce();
    });
});
