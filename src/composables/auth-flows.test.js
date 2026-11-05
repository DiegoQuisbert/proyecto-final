import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { routerPush, loginMock, registerMock } = vi.hoisted(() => ({
    routerPush: vi.fn(),
    loginMock: vi.fn(),
    registerMock: vi.fn(),
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: routerPush }),
}));

vi.mock('../services/auth', () => ({
    login: loginMock,
    register: registerMock,
}));

import useLogin from './useLogin';
import useRegister from './useRegister';

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('localStorage', {
        setItem: vi.fn(),
    });
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe('login flow', () => {
    it('stores success feedback and navigates to posts', async () => {
        loginMock.mockResolvedValue({});
        const emit = vi.fn();
        const { user, loading, handleSubmit } = useLogin(emit);
        user.value = { email: 'artist@example.test', password: 'password' };

        await handleSubmit();

        expect(loginMock).toHaveBeenCalledWith('artist@example.test', 'password');
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'feedback',
            JSON.stringify({ message: '¡Hola de nuevo, artist@example.test!', type: 'success' }),
        );
        expect(emit).toHaveBeenCalledWith('changeFeedback', {
            message: '¡Hola de nuevo, artist@example.test!',
            type: 'success',
        });
        expect(routerPush).toHaveBeenCalledWith('/posts');
        expect(loading.value).toBe(false);
    });

    it('shows an error and stays on the page when login fails', async () => {
        loginMock.mockRejectedValue(new Error('invalid credentials'));
        const { loading, feedback, handleSubmit } = useLogin(vi.fn());

        await handleSubmit();

        expect(feedback.value).toEqual({
            message: 'Las credenciales ingresadas no coinciden.',
            type: 'error',
        });
        expect(routerPush).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });
});

describe('registration flow', () => {
    it('navigates to posts after showing successful feedback', async () => {
        vi.useFakeTimers();
        registerMock.mockResolvedValue({});
        const emit = vi.fn();
        const { user, handleSubmit } = useRegister(emit);
        user.value = {
            email: 'artist@example.test',
            password: 'password',
            display_name: 'artist',
        };

        await handleSubmit();

        expect(registerMock).toHaveBeenCalledWith('artist@example.test', 'password', 'artist');
        expect(emit).toHaveBeenCalledWith('changeFeedback', {
            message: '¡Cuenta creada para artist@example.test!',
            type: 'success',
        });
        expect(routerPush).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1000);
        expect(routerPush).toHaveBeenCalledWith('/posts');
    });

    it('explains when auth account creation succeeded but profile creation failed', async () => {
        const profileError = new Error('profile creation failed');
        profileError.code = 'PROFILE_CREATION_FAILED';
        registerMock.mockRejectedValue(profileError);
        const { feedback, handleSubmit } = useRegister(vi.fn());

        await handleSubmit();

        expect(feedback.value).toEqual({
            message: 'La cuenta ya fue creada, pero no se pudo guardar el perfil. No vuelvas a registrarte con este correo; intentá iniciar sesión o contactá al administrador.',
            type: 'error',
        });
        expect(routerPush).not.toHaveBeenCalled();
    });
});
