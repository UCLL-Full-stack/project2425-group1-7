import commentService from '../../service/commentService';
import commentDb from '../../repository/comment.db';
import { CommentInput, Role, UserInfo } from '../../types';
import { Comment } from '../../model/comment';

describe('Comment Service', () => {
    const mockUserInfo: UserInfo = {
        id: 1,
        username: 'testuser',
        role: 'user' as Role,
        createdAt: new Date(),
        isBlocked: false
    };

    const mockComment = new Comment({
        id: 1,
        author: mockUserInfo,
        body: 'Test comment',
        reviewId: 1,
        createdAt: new Date()
    });

    const mockCommentInput: CommentInput = {
        body: 'Test comment',
        reviewId: 1,
        authorId: 1
    };

    let createCommentMock: jest.Mock;
    let getByIdMock: jest.Mock;
    let deleteByIdMock: jest.Mock;

    beforeEach(() => {
        createCommentMock = jest.fn();
        getByIdMock = jest.fn();
        deleteByIdMock = jest.fn();

        commentDb.createComment = createCommentMock;
        commentDb.getById = getByIdMock;
        commentDb.deleteById = deleteByIdMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createComment', () => {
        test('should create comment with valid input', async () => {
            // Given
            createCommentMock.mockResolvedValue(mockComment);

            // When
            const createComment = () => commentService.createComment(mockCommentInput);

            // Then
            await expect(createComment()).resolves.toEqual(mockComment);
            expect(createCommentMock).toHaveBeenCalledWith(
                expect.any(Comment),
                mockCommentInput.authorId
            );
        });

        test('should show validation errors from Comment model', async () => {
            // Given
            const invalidInput = { ...mockCommentInput, body: '' };

            // When
            const createInvalidComment = () => commentService.createComment(invalidInput);

            // Then
            await expect(createInvalidComment()).rejects.toThrow();
        });
    });

    describe('deleteComment', () => {
        test('should delete comment when user is admin', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockComment);
            deleteByIdMock.mockResolvedValue(undefined);

            // When
            const deleteComment = () => commentService.deleteComment(1, 'admin' as Role, 'adminuser');

            // Then
            await expect(deleteComment()).resolves.not.toThrow();
            expect(deleteByIdMock).toHaveBeenCalledWith(1);
        });

        test('should delete comment when user is moderator', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockComment);
            deleteByIdMock.mockResolvedValue(undefined);

            // When
            const deleteComment = () => commentService.deleteComment(1, 'moderator' as Role, 'moduser');

            // Then
            await expect(deleteComment()).resolves.not.toThrow();
            expect(deleteByIdMock).toHaveBeenCalledWith(1);
        });

        test('should delete comment when user is author', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockComment);
            deleteByIdMock.mockResolvedValue(undefined);

            // When
            const deleteComment = () => commentService.deleteComment(1, 'user' as Role, 'testuser');

            // Then
            await expect(deleteComment()).resolves.not.toThrow();
            expect(deleteByIdMock).toHaveBeenCalledWith(1);
        });

        test('should throw error when regular user tries to delete another user\'s comment', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockComment);

            // When
            const deleteComment = () => commentService.deleteComment(1, 'user' as Role, 'otheruser');

            // Then
            await expect(deleteComment()).rejects.toThrow('You are not authorized to access this resource');
            expect(deleteByIdMock).not.toHaveBeenCalled();
        });

        test('should propagate database errors', async () => {
            // Given
            getByIdMock.mockRejectedValue(new Error('Database error'));

            // When
            const deleteComment = () => commentService.deleteComment(1, 'admin' as Role, 'adminuser');

            // Then
            await expect(deleteComment()).rejects.toThrow('Database error');
        });
    });
});