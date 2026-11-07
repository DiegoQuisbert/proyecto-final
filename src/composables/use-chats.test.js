import { effectScope, nextTick, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { supabaseFrom, getPrivateChatId, getUserProfileById, getFileUrl } = vi.hoisted(() => ({
    supabaseFrom: vi.fn(),
    getPrivateChatId: vi.fn(),
    getUserProfileById: vi.fn(),
    getFileUrl: vi.fn(),
}));

vi.mock('../services/supabase', () => ({
    default: { from: supabaseFrom },
}));
vi.mock('../services/private-chat', () => ({ getPrivateChatId }));
vi.mock('../services/user-profiles', () => ({ getUserProfileById }));
vi.mock('../services/storage', () => ({ getFileUrl }));

import useChats from './useChats';

async function flushChatLoad() {
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();
}

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    getPrivateChatId.mockResolvedValue(17);
    getUserProfileById.mockResolvedValue({
        id: 'other-user',
        display_name: 'Luna Art',
        email: 'luna@example.test',
        avatar: null,
    });
    supabaseFrom.mockImplementation(table => {
        if (table === 'private_chats') {
            return {
                select: () => ({
                    or: () => Promise.resolve({
                        data: [{ user_id1: 'current-user', user_id2: 'other-user' }],
                        error: null,
                    }),
                }),
            };
        }

        return {
            select: () => ({
                eq: () => ({
                    order: () => ({
                        limit: () => Promise.resolve({
                            data: [{ body: 'Hola', created_at: '2026-01-01T10:00:00Z' }],
                            error: null,
                        }),
                    }),
                }),
            }),
        };
    });
});

describe('useChats', () => {
    it('loads, enriches, and filters conversations for the authenticated user', async () => {
        const scope = effectScope();
        const currentUser = ref({ id: 'current-user' });
        let state;

        scope.run(() => {
            state = useChats(currentUser);
        });
        await flushChatLoad();

        expect(state.chats.value).toHaveLength(1);
        expect(state.chats.value[0]).toMatchObject({
            id: 'other-user',
            chat_id: 17,
            lastMessage: 'Hola',
            profile: { display_name: 'Luna Art' },
        });
        expect(getPrivateChatId).toHaveBeenCalledWith('current-user', 'other-user');

        state.search.value = 'luna';
        expect(state.filteredChats.value).toHaveLength(1);
        state.search.value = 'missing';
        expect(state.filteredChats.value).toHaveLength(0);

        scope.stop();
    });
});
