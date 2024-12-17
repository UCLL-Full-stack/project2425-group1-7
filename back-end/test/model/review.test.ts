import { Review } from '../../model/review';
import { User } from '../../model/user';
import { Comment } from '../../model/comment';

describe('Review Class', () => {

    const mockUser = new User({
        id: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345',
        lists: [],
        reviews: []
    });

    const mockComment = new Comment({
        id: 1,
        author: mockUser,
        body: 'Test comment',
        reviewId: 1,
        createdAt: new Date()
    });

    const validReviewData = {
        id: 1,
        author: mockUser,
        title: 'Great Album',
        body: 'This album is amazing!',
        starRating: 5,
        albumId: '123',
        createdAt: new Date(),
        comments: [mockComment],
        likes: [1, 2]
    };

    let review: Review;
    let identicalReview: Review;

    beforeEach(() => {
        review = new Review(validReviewData);
        identicalReview = new Review(validReviewData);
    });

    describe('Constructor and Validation', () => {
        test('should create review instance with valid data', () => {
            expect(review.getId()).toBe(1);
            expect(review.getUser()).toEqual(mockUser);
            expect(review.getTitle()).toBe('Great Album');
            expect(review.getDescription()).toBe('This album is amazing!');
            expect(review.getStarRating()).toBe(5);
            expect(review.getAlbum()).toBe('123');
            expect(review.getComments()).toEqual([mockComment]);
            expect(review.getLikes()).toEqual([1, 2]);
            expect(review.getCreatedAt()).toBeInstanceOf(Date);
        });

        test('should throw error for empty title', () => {
            expect(() => {
                new Review({
                    ...validReviewData,
                    title: ''
                });
            }).toThrow('title and body cannot be empty');
        });

        test('should throw error for empty body', () => {
            expect(() => {
                new Review({
                    ...validReviewData,
                    body: ''
                });
            }).toThrow('title and body cannot be empty');
        });

        test('should throw error for empty albumId', () => {
            expect(() => {
                new Review({
                    ...validReviewData,
                    albumId: ''
                });
            }).toThrow('review need an albumId');
        });

        test('should throw error for star rating below 0', () => {
            expect(() => {
                new Review({
                    ...validReviewData,
                    starRating: -1
                });
            }).toThrow('starRating should be between 0 and 5 inclusively');
        });

        test('should throw error for star rating above 5', () => {
            expect(() => {
                new Review({
                    ...validReviewData,
                    starRating: 6
                });
            }).toThrow('starRating should be between 0 and 5 inclusively');
        });
    });

    describe('Getters', () => {
        test('should get id', () => {
            expect(review.getId()).toBe(1);
        });

        test('should get user', () => {
            expect(review.getUser()).toEqual(mockUser);
        });

        test('should get title', () => {
            expect(review.getTitle()).toBe('Great Album');
        });

        test('should get description (body)', () => {
            expect(review.getDescription()).toBe('This album is amazing!');
        });

        test('should get star rating', () => {
            expect(review.getStarRating()).toBe(5);
        });

        test('should get album id', () => {
            expect(review.getAlbum()).toBe('123');
        });

        test('should get comments', () => {
            expect(review.getComments()).toEqual([mockComment]);
        });

        test('should get likes', () => {
            expect(review.getLikes()).toEqual([1, 2]);
        });

        test('should get created date', () => {
            expect(review.getCreatedAt()).toBeInstanceOf(Date);
        });
    });

    describe('Setters', () => {
        test('should set valid star rating', () => {
            review.setStarRating(3);
            expect(review.getStarRating()).toBe(3);
        });

        test('should throw error when setting invalid star rating below 0', () => {
            expect(() => {
                review.setStarRating(-1);
            }).toThrow('starRating should be between 0 and 5 inclusively');
        });

        test('should throw error when setting invalid star rating above 5', () => {
            expect(() => {
                review.setStarRating(6);
            }).toThrow('starRating should be between 0 and 5 inclusively');
        });
    });

    describe('equals method', () => {
        test('should return true for identical reviews', () => {
            expect(review.equals(identicalReview)).toBeTruthy();
        });

        test('should return false for reviews with different titles', () => {
            const differentReview = new Review({
                ...validReviewData,
                title: 'Different Title'
            });
            expect(review.equals(differentReview)).toBeFalsy();
        });

        test('should return false for reviews with different bodies', () => {
            const differentReview = new Review({
                ...validReviewData,
                body: 'Different body'
            });
            expect(review.equals(differentReview)).toBeFalsy();
        });

        test('should return false for reviews with different ratings', () => {
            const differentReview = new Review({
                ...validReviewData,
                starRating: 3
            });
            expect(review.equals(differentReview)).toBeFalsy();
        });
    });

    describe('static from method', () => {
        test('should create Review from Prisma data', () => {
            const prismaData = {
                id: 1,
                createdAt: new Date(),
                title: 'Great Album',
                body: 'This album is amazing!',
                starRating: 5,
                albumID: '123',
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: new Date(),
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345'
                },
                comments: [{
                    id: 1,
                    createdAt: new Date(),
                    body: 'Test comment',
                    authorId: 1,
                    reviewId: 1,
                    author: {
                        id: 1,
                        createdAt: new Date(),
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password12345'
                    }
                }],
                likes: [{
                    id: 2,
                    createdAt: new Date(),
                    email: 'liker@example.com',
                    username: 'liker',
                    password: 'password12345'
                }]
            };

            const reviewFromPrisma = Review.from(prismaData);
            expect(reviewFromPrisma).toBeInstanceOf(Review);
            expect(reviewFromPrisma.getId()).toBe(prismaData.id);
            expect(reviewFromPrisma.getTitle()).toBe(prismaData.title);
            expect(reviewFromPrisma.getDescription()).toBe(prismaData.body);
            expect(reviewFromPrisma.getStarRating()).toBe(prismaData.starRating);
            expect(reviewFromPrisma.getAlbum()).toBe(prismaData.albumID);
            expect(reviewFromPrisma.getUser()).toBeInstanceOf(User);
            expect(reviewFromPrisma.getComments()[0]).toBeInstanceOf(Comment);
            expect(reviewFromPrisma.getLikes()).toEqual([2]);
        });

        test('should handle empty comments and likes in Prisma data', () => {
            const prismaData = {
                id: 1,
                createdAt: new Date(),
                title: 'Great Album',
                body: 'This album is amazing!',
                starRating: 5,
                albumID: '123',
                authorId: 1,
                author: {
                    id: 1,
                    createdAt: new Date(),
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345'
                }
            };

            const reviewFromPrisma = Review.from(prismaData);
            expect(reviewFromPrisma.getComments()).toEqual([]);
            expect(reviewFromPrisma.getLikes()).toEqual([]);
        });
    });
});