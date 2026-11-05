import { beforeEach, describe, expect, it, vi } from 'vitest';
import supabase from './supabase';
import { getPrivateChatId } from './private-chat';

vi.mock('./supabase', () => ({
    default: {
        from: vi.fn(),
    },
}));

function createSelectQuery(data, error = null) {
    const query = {
        eq: vi.fn(),
        then(resolve, reject) {
            return Promise.resolve({ data, error }).then(resolve, reject);
        },
    };

    query.eq.mockReturnValue(query);
    return query;
}

function setupChatQueries(existingChats, createdChatId = 52, error = null) {
    const selectQuery = createSelectQuery(existingChats, error);
    const select = vi.fn(() => selectQuery);
    const insertSelect = vi.fn().mockResolvedValue({
        data: [{ id: createdChatId }],
        error: null,
    });
    const insert = vi.fn(() => ({ select: insertSelect }));

    supabase.from.mockReturnValue({ select, insert });

    return { select, selectQuery, insert };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getPrivateChatId', () => {
    it('reuses the cached id regardless of user order', async () => {
        const { select, selectQuery } = setupChatQueries([{ id: 41 }]);

        await expect(getPrivateChatId('user-b', 'user-a')).resolves.toBe(41);
        await expect(getPrivateChatId('user-a', 'user-b')).resolves.toBe(41);

        expect(supabase.from).toHaveBeenCalledOnce();
        expect(select).toHaveBeenCalledWith('id');
        expect(selectQuery.eq.mock.calls).toEqual([
            ['user_id1', 'user-a'],
            ['user_id2', 'user-b'],
        ]);
    });

    it('creates a chat when no matching chat exists', async () => {
        const { insert } = setupChatQueries([]);

        await expect(getPrivateChatId('user-d', 'user-c')).resolves.toBe(52);

        expect(supabase.from).toHaveBeenCalledTimes(2);
        expect(insert).toHaveBeenCalledWith({
            user_id1: 'user-c',
            user_id2: 'user-d',
        });
    });

    it('propagates errors while looking up an existing chat', async () => {
        const queryError = new Error('query failed');
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { insert } = setupChatQueries(null, 52, queryError);

        await expect(getPrivateChatId('user-f', 'user-e')).rejects.toThrow('query failed');

        expect(insert).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });
});
