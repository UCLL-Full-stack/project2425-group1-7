import commentService from '../../service/commentService';
import commentDb from '../../repository/comment.db';
import { CommentInput } from '../../types';
import { Comment } from '../../model/comment';

const mockComment = new Comment({
    id: 1,
    author: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
    },
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

beforeEach(() => {
    createCommentMock = jest.fn();
    commentDb.createComment = createCommentMock;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Comment Service', () => {
    describe('createComment', () => {
        test('should create comment with valid input', async () => {
            // Given
            createCommentMock.mockResolvedValue(mockComment);

            // When
            await commentService.createComment(mockCommentInput);

            // Then
            expect(createCommentMock).toHaveBeenCalledWith(mockCommentInput);
        });
    });
});