import { Review } from '../../model/review';
import { Comment } from '../../model/comment';
import { Role, UserInfo } from '../../types';

describe('Review Class', () => {
    const mockUserInfo: UserInfo = {
        id: 1,
        createdAt: new Date(),
        username: 'testuser',
        role: 'user' as Role,
        isBlocked: false,
        lists: [],
        reviews: [],
        following: [],
        followedBy: []
    };

    const mockComment = new Comment({
        id: 1,
        author: mockUserInfo,
        body: 'Test comment',
        reviewId: 1,
        createdAt: new Date()
    });

    const validReviewData = {
        id: 1,
        author: mockUserInfo,
        title: 'Great Album',
        body: 'This album is amazing!',
        starRating: 5,
        albumId: '123',
        createdAt: new Date(),
        comments: [mockComment],
        likes: [1, 2]
    };

    describe('Constructor and Validation', () => {
        test('should create review instance with valid data', () => {
            const createValidReview = () => new Review(validReviewData);
            const review = createValidReview();

            expect(review.getId()).toBe(validReviewData.id);
            expect(review.getAuthor()).toEqual(mockUserInfo);
            expect(review.getTitle()).toBe(validReviewData.title);
            expect(review.getBody()).toBe(validReviewData.body);
            expect(review.getDescription()).toBe(validReviewData.body);
            expect(review.getStarRating()).toBe(validReviewData.starRating);
            expect(review.getAlbum()).toBe(validReviewData.albumId);
            expect(review.getComments()).toEqual(validReviewData.comments);
            expect(review.getLikes()).toEqual(validReviewData.likes);
            expect(review.getCreatedAt()).toBe(validReviewData.createdAt);
        });

        test('should throw error for empty title', () => {
            const createInvalidReview = () => new Review({
                ...validReviewData,
                title: ''
            });

            expect(createInvalidReview).toThrowError('title and body cannot be empty');
        });

        test('should throw error for empty body', () => {
            const createInvalidReview = () => new Review({
                ...validReviewData,
                body: ''
            });

            expect(createInvalidReview).toThrowError('title and body cannot be empty');
        });

        test('should throw error for empty albumId', () => {
            const createInvalidReview = () => new Review({
                ...validReviewData,
                albumId: ''
            });

            expect(createInvalidReview).toThrowError('review need an albumId');
        });

        test('should throw error for star rating below 0', () => {
            const createInvalidReview = () => new Review({
                ...validReviewData,
                starRating: -1
            });

            expect(createInvalidReview).toThrowError('starRating should be between 0 and 5 inclusively');
        });

        test('should throw error for star rating above 5', () => {
            const createInvalidReview = () => new Review({
                ...validReviewData,
                starRating: 6
            });

            expect(createInvalidReview).toThrowError('starRating should be between 0 and 5 inclusively');
        });
    });

    describe('Setters', () => {
        test('should set valid star rating', () => {
            const review = new Review(validReviewData);
            const setValidRating = () => review.setStarRating(3);

            setValidRating();
            expect(review.getStarRating()).toBe(3);
        });

        test('should throw error when setting invalid star rating below 0', () => {
            const review = new Review(validReviewData);
            const setInvalidRating = () => review.setStarRating(-1);

            expect(setInvalidRating).toThrowError('starRating should be between 0 and 5 inclusively');
        });

        test('should throw error when setting invalid star rating above 5', () => {
            const review = new Review(validReviewData);
            const setInvalidRating = () => review.setStarRating(6);

            expect(setInvalidRating).toThrowError('starRating should be between 0 and 5 inclusively');
        });
    });

    describe('equals method', () => {
        test('should return true for identical reviews', () => {
            const review1 = new Review(validReviewData);
            const review2 = new Review(validReviewData);

            expect(review1.equals(review2)).toBeTruthy();
        });

        test('should return false for reviews with different titles', () => {
            const review1 = new Review(validReviewData);
            const review2 = new Review({
                ...validReviewData,
                title: 'Different Title'
            });

            expect(review1.equals(review2)).toBeFalsy();
        });

        test('should return false for reviews with different bodies', () => {
            const review1 = new Review(validReviewData);
            const review2 = new Review({
                ...validReviewData,
                body: 'Different body'
            });

            expect(review1.equals(review2)).toBeFalsy();
        });

        test('should return false for reviews with different star ratings', () => {
            const review1 = new Review(validReviewData);
            const review2 = new Review({
                ...validReviewData,
                starRating: 3
            });

            expect(review1.equals(review2)).toBeFalsy();
        });
    });

    describe('static from method', () => {
        test('should create Review from Prisma data', () => {
            const createdAt = new Date();
            const prismaData = {
                id: 1,
                createdAt: createdAt,
                title: 'Great Album',
                body: 'This album is amazing!',
                starRating: 5,
                albumID: '123',
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: createdAt,
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345',
                    role: 'user',
                    isBlocked: false,
                    lists: [],
                    reviews: [],
                    following: [],
                    followedBy: []
                },
                comments: [{
                    id: 1,
                    createdAt: createdAt,
                    body: 'Test comment',
                    authorId: 1,
                    reviewId: 1,
                    author: {
                        id: 1,
                        createdAt: createdAt,
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password12345',
                        role: 'user',
                        isBlocked: false,
                        lists: [],
                        reviews: [],
                        following: [],
                        followedBy: []
                    }
                }],
                likes: [{
                    id: 2,
                    createdAt: createdAt,
                    email: 'liker@example.com',
                    username: 'liker',
                    password: 'password12345',
                    role: 'user',
                    isBlocked: false,
                    lists: [],
                    reviews: [],
                    following: [],
                    followedBy: []
                }]
            };

            const reviewFromPrisma = Review.from(prismaData);

            expect(reviewFromPrisma).toBeInstanceOf(Review);
            expect(reviewFromPrisma.getId()).toBe(prismaData.id);
            expect(reviewFromPrisma.getTitle()).toBe(prismaData.title);
            expect(reviewFromPrisma.getBody()).toBe(prismaData.body);
            expect(reviewFromPrisma.getStarRating()).toBe(prismaData.starRating);
            expect(reviewFromPrisma.getAlbum()).toBe(prismaData.albumID);
            expect(reviewFromPrisma.getAuthor()).toEqual({
                id: prismaData.author.id,
                username: prismaData.author.username,
                role: prismaData.author.role as Role,
                createdAt: prismaData.author.createdAt,
                isBlocked: prismaData.author.isBlocked
            });
            expect(reviewFromPrisma.getLikes()).toEqual([2]);
        });

        test('should handle empty comments and likes in Prisma data', () => {
            const createdAt = new Date();
            const prismaData = {
                id: 1,
                createdAt: createdAt,
                title: 'Great Album',
                body: 'This album is amazing!',
                starRating: 5,
                albumID: '123',
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: createdAt,
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345',
                    role: 'user',
                    isBlocked: false,
                    lists: [],
                    reviews: [],
                    following: [],
                    followedBy: []
                }
            };

            const reviewFromPrisma = Review.from(prismaData);
            expect(reviewFromPrisma.getComments()).toEqual([]);
            expect(reviewFromPrisma.getLikes()).toEqual([]);
        });
    });
});