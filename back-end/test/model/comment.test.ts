import { Comment } from '../../model/comment';
import { UserInfo } from '../../types';

describe('Comment Class', () => {
    // Create mock UserInfo instead of User instance
    const mockUserInfo: UserInfo = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
    };

    const validCommentData = {
        id: 1,
        author: mockUserInfo,
        body: 'This is a test comment',
        reviewId: 1,
        createdAt: new Date()
    };

    let comment: Comment;
    let identicalComment: Comment;

    beforeEach(() => {
        comment = new Comment(validCommentData);
        identicalComment = new Comment(validCommentData);
    });

    describe('Constructor', () => {
        test('should create comment instance with valid data', () => {
            expect(comment.getId()).toBe(1);
            expect(comment.getUser()).toEqual(mockUserInfo);
            expect(comment.getBody()).toBe('This is a test comment');
            expect(comment.getReview()).toBe(1);
            expect(comment.getCreatedAt()).toBeInstanceOf(Date);
        });

        test('should throw error if body is empty', () => {
            expect(() => {
                new Comment({
                    ...validCommentData,
                    body: ''
                });
            }).toThrow('comment cannot be empty');
        });

        test('should throw error if reviewId is missing', () => {
            expect(() => {
                new Comment({
                    ...validCommentData,
                    reviewId: 0
                });
            }).toThrow('comment must belong to a review');
        });
    });

    describe('Getters', () => {
        test('should get id', () => {
            expect(comment.getId()).toBe(1);
        });

        test('should get user', () => {
            expect(comment.getUser()).toEqual(mockUserInfo);
        });

        test('should get body', () => {
            expect(comment.getBody()).toBe('This is a test comment');
        });

        test('should get review id', () => {
            expect(comment.getReview()).toBe(1);
        });

        test('should get created date', () => {
            expect(comment.getCreatedAt()).toBeInstanceOf(Date);
        });
    });

    describe('static from method', () => {
        test('should create Comment from Prisma data', () => {
            const prismaData = {
                id: 1,
                createdAt: new Date(),
                body: 'This is a test comment',
                reviewId: 1,
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: new Date(),
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345'
                }
            };

            const commentFromPrisma = Comment.from(prismaData);
            expect(commentFromPrisma).toBeInstanceOf(Comment);
            expect(commentFromPrisma.getId()).toBe(prismaData.id);
            expect(commentFromPrisma.getBody()).toBe(prismaData.body);
            expect(commentFromPrisma.getReview()).toBe(prismaData.reviewId);
            expect(commentFromPrisma.getUser()).toEqual({
                id: prismaData.author.id,
                email: prismaData.author.email,
                username: prismaData.author.username
            });
            expect(commentFromPrisma.getCreatedAt()).toBeInstanceOf(Date);
        });
    });
});