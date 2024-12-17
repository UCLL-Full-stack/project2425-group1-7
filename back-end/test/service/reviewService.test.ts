import { Review } from '../../model/review';
import reviewService from '../../service/reviewService';
import reviewDb from '../../repository/review.db';
import { ReviewInput } from '../../types';
import { User } from '../../model/user';

// Create mock user
const mockUser = new User({
    id: 1,
    createdAt: new Date(),
    email: 'test@example.com',
    username: 'testuser',
    password: 'password12345',
    lists: [],
    reviews: []
});

// Create mock review
const mockReview = new Review({
    id: 1,
    author: mockUser,
    title: 'Great Album',
    body: 'This album is amazing!',
    starRating: 5,
    albumId: '123',
    createdAt: new Date(),
});

const mockReviewInput: ReviewInput = {
    title: 'Great Album',
    body: 'This album is amazing!',
    starRating: 5,
    albumId: '123',
    authorId: 1
};

// Setup mocks
let findAllReviewsMock: jest.Mock;
let findByIdMock: jest.Mock;
let findUserReviewsMock: jest.Mock;
let createReviewMock: jest.Mock;
let likeReviewMock: jest.Mock;
let deleteReviewMock: jest.Mock;

beforeEach(() => {
    findAllReviewsMock = jest.fn();
    findByIdMock = jest.fn();
    findUserReviewsMock = jest.fn();
    createReviewMock = jest.fn();
    likeReviewMock = jest.fn();
    deleteReviewMock = jest.fn();

    // Setup db mocks
    reviewDb.findAllReviews = findAllReviewsMock;
    reviewDb.findById = findByIdMock;
    reviewDb.findUserReviews = findUserReviewsMock;
    reviewDb.createReview = createReviewMock;
    reviewDb.likeReview = likeReviewMock;
    reviewDb.deleteReview = deleteReviewMock;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Review Service', () => {
    describe('getAllReviews', () => {
        test('should return all reviews', async () => {
            // Given
            findAllReviewsMock.mockResolvedValue([mockReview]);

            // When
            const reviews = await reviewService.getAllReviews();

            // Then
            expect(findAllReviewsMock).toHaveBeenCalled();
            expect(reviews).toEqual([mockReview]);
        });

        test('should handle db error', async () => {
            // Given
            findAllReviewsMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(reviewService.getAllReviews()).rejects.toThrow('DB Error');
        });
    });

    describe('getReviewById', () => {
        test('should return review by id', async () => {
            // Given
            findByIdMock.mockResolvedValue(mockReview);

            // When
            const review = await reviewService.getReviewById(1);

            // Then
            expect(findByIdMock).toHaveBeenCalledWith(1);
            expect(review).toEqual(mockReview);
        });

        test('should throw error if review not found', async () => {
            // Given
            findByIdMock.mockResolvedValue(null);

            // Then
            await expect(reviewService.getReviewById(999))
                .rejects
                .toThrow('review not found');
        });
    });

    describe('getUserReviews', () => {
        test('should return reviews for user', async () => {
            // Given
            findUserReviewsMock.mockResolvedValue([mockReview]);

            // When
            const reviews = await reviewService.getUserReviews(1);

            // Then
            expect(findUserReviewsMock).toHaveBeenCalledWith(1);
            expect(reviews).toEqual([mockReview]);
        });

        test('should handle db error', async () => {
            // Given
            findUserReviewsMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(reviewService.getUserReviews(1))
                .rejects
                .toThrow('DB Error');
        });
    });

    describe('createReview', () => {
        test('should create review with valid input', async () => {
            // Given
            createReviewMock.mockResolvedValue(mockReview);

            // When
            const result = await reviewService.createReview(mockReviewInput);

            // Then
            expect(createReviewMock).toHaveBeenCalledWith(mockReviewInput);
            expect(result).toEqual(mockReview);
        });

        test('should handle creation error', async () => {
            // Given
            createReviewMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(reviewService.createReview(mockReviewInput))
                .rejects
                .toThrow('DB Error');
        });
    });

    describe('likeReview', () => {
        test('should update review likes', async () => {
            // Given
            const newLikes = [1, 2, 3];
            findByIdMock.mockResolvedValue(mockReview);

            const updatedReview = new Review({
                id: mockReview.getId(),
                author: mockReview.getUser(),
                title: mockReview.getTitle(),
                body: mockReview.getDescription(),
                starRating: mockReview.getStarRating(),
                albumId: mockReview.getAlbum(),
                createdAt: mockReview.getCreatedAt(),
                comments: mockReview.getComments(),
                likes: newLikes
            });
            likeReviewMock.mockResolvedValue(updatedReview);

            // When
            const result = await reviewService.likeReview(1, newLikes);

            // Then
            expect(findByIdMock).toHaveBeenCalledWith(1);
            expect(likeReviewMock).toHaveBeenCalledWith(1, newLikes);
            expect(result.getLikes()).toEqual(newLikes);
        });

        test('should throw error if review does not exist', async () => {
            // Given
            findByIdMock.mockResolvedValue(null);

            // Then
            await expect(reviewService.likeReview(999, [1]))
                .rejects
                .toThrow('Review Does not Exist');
        });
    });

    describe('deleteReview', () => {
        test('should delete review', async () => {
            // Given
            deleteReviewMock.mockResolvedValue(undefined);

            // When
            await reviewService.deleteReview(1);

            // Then
            expect(deleteReviewMock).toHaveBeenCalledWith(1);
        });

        test('should handle deletion error', async () => {
            // Given
            deleteReviewMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(reviewService.deleteReview(1))
                .rejects
                .toThrow('DB Error');
        });
    });
});