import { effectScope, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getUserProfileById } = vi.hoisted(() => ({
    getUserProfileById: vi.fn(),
}));

vi.mock('../services/user-profiles', () => ({ getUserProfileById }));
vi.mock('../services/storage', () => ({ getFileUrl: vi.fn(path => `https://files.test/${path}`) }));

import useUserProfile from './useUserProfile';

async function flushProfileRequests() {
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
}

beforeEach(() => {
    vi.resetAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('useUserProfile', () => {
    it('loads a new profile when the route id changes', async () => {
        getUserProfileById
            .mockResolvedValueOnce({ id: 'user-1', display_name: 'First user', avatar: null })
            .mockResolvedValueOnce({ id: 'user-2', display_name: 'Second user', avatar: null });
        const profileId = ref('user-1');
        const scope = effectScope();
        let state;

        scope.run(() => {
            state = useUserProfile(profileId);
        });
        await flushProfileRequests();

        expect(state.user.value.display_name).toBe('First user');

        profileId.value = 'user-2';
        await flushProfileRequests();

        expect(getUserProfileById).toHaveBeenNthCalledWith(2, 'user-2');
        expect(state.user.value.display_name).toBe('Second user');
        expect(state.loadingUser.value).toBe(false);
        scope.stop();
    });

    it('ignores a stale profile response after the route id changes', async () => {
        let resolveFirstProfile;
        getUserProfileById
            .mockImplementationOnce(() => new Promise(resolve => {
                resolveFirstProfile = resolve;
            }))
            .mockResolvedValueOnce({ id: 'user-2', display_name: 'Second user', avatar: null });
        const profileId = ref('user-1');
        const scope = effectScope();
        let state;

        scope.run(() => {
            state = useUserProfile(profileId);
        });

        profileId.value = 'user-2';
        await flushProfileRequests();
        resolveFirstProfile({ id: 'user-1', display_name: 'First user', avatar: null });
        await flushProfileRequests();

        expect(state.user.value.id).toBe('user-2');
        expect(state.user.value.display_name).toBe('Second user');
        scope.stop();
    });
});
