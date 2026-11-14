import { effectScope, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getUserProfileById, getUserProfileByEmailPrefix } = vi.hoisted(() => ({
    getUserProfileById: vi.fn(),
    getUserProfileByEmailPrefix: vi.fn(),
}));

vi.mock('../services/user-profiles', () => ({ getUserProfileById, getUserProfileByEmailPrefix }));
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
        const uuid1 = '11111111-1111-1111-1111-111111111111';
        const uuid2 = '22222222-2222-2222-2222-222222222222';
        getUserProfileById
            .mockResolvedValueOnce({ id: uuid1, display_name: 'First user', avatar: null })
            .mockResolvedValueOnce({ id: uuid2, display_name: 'Second user', avatar: null });
        const profileId = ref(uuid1);
        const scope = effectScope();
        let state;

        scope.run(() => {
            state = useUserProfile(profileId);
        });
        await flushProfileRequests();

        expect(state.user.value.display_name).toBe('First user');

        profileId.value = uuid2;
        await flushProfileRequests();

        expect(getUserProfileById).toHaveBeenNthCalledWith(2, uuid2);
        expect(state.user.value.display_name).toBe('Second user');
        expect(state.loadingUser.value).toBe(false);
        scope.stop();
    });

    it('ignores a stale profile response after the route id changes', async () => {
        const uuid1 = '11111111-1111-1111-1111-111111111111';
        const uuid2 = '22222222-2222-2222-2222-222222222222';
        let resolveFirstProfile;
        getUserProfileById
            .mockImplementationOnce(() => new Promise(resolve => {
                resolveFirstProfile = resolve;
            }))
            .mockResolvedValueOnce({ id: uuid2, display_name: 'Second user', avatar: null });
        const profileId = ref(uuid1);
        const scope = effectScope();
        let state;

        scope.run(() => {
            state = useUserProfile(profileId);
        });

        profileId.value = uuid2;
        await flushProfileRequests();
        resolveFirstProfile({ id: uuid1, display_name: 'First user', avatar: null });
        await flushProfileRequests();

        expect(state.user.value.id).toBe(uuid2);
        expect(state.user.value.display_name).toBe('Second user');
        scope.stop();
    });
});
