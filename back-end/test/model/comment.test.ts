import { Comment } from '../../model/comment';
import { Role, UserInfo } from '../../types';

describe('Comment Class', () => {
    const mockUserInfo: UserInfo = {
        id: 1,
        username: 'testuser',
        role: 'user' as Role,
        createdAt: new Date(),
        isBlocked: false
    };

    const validCommentData = {
        id: 1,
        author: mockUserInfo,
        body: 'This is a test comment',
        reviewId: 1,
        createdAt: new Date()
    };

    describe('Constructor Validation', () => {
        test('should create comment instance with valid data', () => {
            const comment = new Comment(validCommentData);
            expect(comment).toBeInstanceOf(Comment);
        });

        test('should throw error if body is empty', () => {
            const createInvalidComment = () => new Comment({
                ...validCommentData,
                body: ''
            });

            expect(createInvalidComment).toThrowError('comment cannot be empty');
        });

        test('should throw error if reviewId is missing', () => {
            const createInvalidComment = () => new Comment({
                ...validCommentData,
                reviewId: 0
            });

            expect(createInvalidComment).toThrowError('comment must belong to a review');
        });
    });

    describe('Getters', () => {
        let comment: Comment;

        beforeEach(() => {
            comment = new Comment(validCommentData);
        });

        test('should get id', () => {
            expect(comment.getId()).toBe(validCommentData.id);
        });

        test('should get author', () => {
            expect(comment.getAuthor()).toEqual(mockUserInfo);
        });

        test('should get body', () => {
            expect(comment.getBody()).toBe(validCommentData.body);
        });

        test('should get review id', () => {
            expect(comment.getReview()).toBe(validCommentData.reviewId);
        });

        test('should get created date', () => {
            expect(comment.getCreatedAt()).toBe(validCommentData.createdAt);
        });
    });
    describe('static from method', () => {
        test('should create Comment from Prisma data', () => {
            const createdAt = new Date();
            const prismaData = {
                id: 1,
                createdAt: createdAt,
                body: 'This is a test comment',
                reviewId: 1,
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: createdAt,
                    email: 'test@example.com',
                    username: 'testuser',
                    role: 'user',
                    isBlocked: false,
                    password: 'password12345'
                }
            };

            const commentFromPrisma = Comment.from(prismaData);

            expect(commentFromPrisma).toBeInstanceOf(Comment);
            expect(commentFromPrisma.getId()).toBe(prismaData.id);
            expect(commentFromPrisma.getBody()).toBe(prismaData.body);
            expect(commentFromPrisma.getReview()).toBe(prismaData.reviewId);
            expect(commentFromPrisma.getAuthor()).toEqual({
                id: prismaData.author.id,
                username: prismaData.author.username,
                role: prismaData.author.role as Role,
                createdAt: prismaData.author.createdAt,
                isBlocked: prismaData.author.isBlocked
            });
            expect(commentFromPrisma.getCreatedAt()).toBe(prismaData.createdAt);
        });
    });
});