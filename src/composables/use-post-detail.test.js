import { effectScope, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
    routerPush,
    getPostById,
    getRepliesByPostId,
    getUserProfileById,
    getFileUrl,
} = vi.hoisted(() => ({
    routerPush: vi.fn(),
    getPostById: vi.fn(),
    getRepliesByPostId: vi.fn(),
    getUserProfileById: vi.fn(),
    getFileUrl: vi.fn(path => `https://files.test/${path}`),
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: routerPush }),
}));

vi.mock('../services/posts', () => ({
    getPostById,
    saveReply: vi.fn(),
    getRepliesByPostId,
    handleDeletePost: vi.fn(),
}));

vi.mock('../services/user-profiles', () => ({ getUserProfileById }));
vi.mock('../services/storage', () => ({
    getFileUrl,
    uploadFile: vi.fn(),
}));

import usePostDetail from './usePostDetail';

async function flushPostRequests() {
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();
}

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    getFileUrl.mockImplementation(path => `https://files.test/${path}`);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('usePostDetail', () => {
    it('loads enriched post data again when the post id changes', async () => {
        getPostById
            .mockResolvedValueOnce({ id: 'post-1', sender_id: 'user-1', multimedia: 'first.jpg' })
            .mockResolvedValueOnce({ id: 'post-2', sender_id: 'user-2', multimedia: null });
        getRepliesByPostId
            .mockResolvedValueOnce([{ id: 'reply-1', sender_id: 'user-3', multimedia: 'reply.jpg' }])
            .mockResolvedValueOnce([]);
        getUserProfileById.mockImplementation(async userId => ({
            id: userId,
            display_name: `Name ${userId}`,
            pronouns: 'they/them',
            avatar: null,
        }));
        const postId = ref('post-1');
        const scope = effectScope();
        let state;

        scope.run(() => {
            state = usePostDetail(postId, ref({ id: 'current-user', email: 'current@example.test' }));
        });
        await flushPostRequests();
        await vi.waitFor(() => expect(state.replies.value).toHaveLength(1));

        expect(state.post.value).toMatchObject({
            id: 'post-1',
            display_name: 'Name user-1',
            mediaUrl: 'https://files.test/post/first.jpg',
        });
        expect(state.replies.value[0]).toMatchObject({
            id: 'reply-1',
            display_name: 'Name user-3',
            mediaUrl: 'https://files.test/post_replies/reply.jpg',
        });

        postId.value = 'post-2';
        await flushPostRequests();

        expect(getPostById).toHaveBeenNthCalledWith(2, 'post-2');
        expect(state.post.value).toMatchObject({ id: 'post-2', display_name: 'Name user-2', mediaUrl: null });
        expect(state.replies.value).toEqual([]);
        expect(state.loading.value).toBe(false);
        scope.stop();
    });
});
