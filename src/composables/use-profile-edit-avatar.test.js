import { effectScope } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { routerPush, updateCurrentUserAvatar } = vi.hoisted(() => ({
    routerPush: vi.fn(),
    updateCurrentUserAvatar: vi.fn(),
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: routerPush }),
}));

vi.mock('../services/auth', () => ({ updateCurrentUserAvatar }));

import useProfileEditAvatar from './useProfileEditAvatar';

function createAvatarForm() {
    const scope = effectScope();
    let form;
    scope.run(() => {
        form = useProfileEditAvatar();
    });
    return { form, scope };
}

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('useProfileEditAvatar', () => {
    it('requires an image before submitting', async () => {
        const { form, scope } = createAvatarForm();

        await form.handleSubmit();

        expect(updateCurrentUserAvatar).not.toHaveBeenCalled();
        expect(form.error.value).toBe('Seleccioná una imagen para actualizar.');
        scope.stop();
    });

    it('updates the avatar and returns to the profile on success', async () => {
        updateCurrentUserAvatar.mockResolvedValue(undefined);
        const { form, scope } = createAvatarForm();
        const file = { name: 'avatar.png' };
        form.avatar.value.file = file;

        await form.handleSubmit();

        expect(updateCurrentUserAvatar).toHaveBeenCalledWith(file);
        expect(routerPush).toHaveBeenCalledWith('/mi-perfil');
        expect(form.editing.value).toBe(false);
        scope.stop();
    });

    it('keeps the form open and shows an error when the upload fails', async () => {
        updateCurrentUserAvatar.mockRejectedValue(new Error('upload failed'));
        const { form, scope } = createAvatarForm();
        form.avatar.value.file = { name: 'avatar.png' };

        await form.handleSubmit();

        expect(routerPush).not.toHaveBeenCalled();
        expect(form.error.value).toBe('No se pudo actualizar la foto de perfil. Intentá nuevamente.');
        expect(form.editing.value).toBe(false);
        scope.stop();
    });
});
