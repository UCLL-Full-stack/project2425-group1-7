import { Comment } from '../../model/comment';
import { User } from '../../model/user';

describe('Comment Class', () => {

    const mockUser = new User({
        id: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345',
        lists: [],
        reviews: []
    });

    const validCommentData = {
        id: 1,
        author: mockUser,
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
            expect(comment.getUser()).toEqual(mockUser);
            expect(comment.getBody()).toBe('This is a test comment');
            expect(comment.getReview()).toBe(1);
            expect(comment.getCreatedAt()).toBeInstanceOf(Date);
        });
    });

    describe('Getters', () => {
        test('should get id', () => {
            expect(comment.getId()).toBe(1);
        });

        test('should get user', () => {
            expect(comment.getUser()).toEqual(mockUser);
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
            expect(commentFromPrisma.getUser()).toBeInstanceOf(User);
            expect(commentFromPrisma.getCreatedAt()).toBeInstanceOf(Date);
        });
    });
});