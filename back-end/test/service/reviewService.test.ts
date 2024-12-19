import { Review } from '../../model/review';
import reviewService from '../../service/reviewService';
import reviewDb from '../../repository/review.db';
import { ReviewInput, Role, UserInfo } from '../../types';

describe('Review Service', () => {
    const mockUserInfo: UserInfo = {
        id: 1,
        username: 'testUser',
        role: 'user' as Role,
        createdAt: new Date(),
        isBlocked: false,
        lists: [],
        reviews: [],
        following: [],
        followedBy: []
    };

    const mockReview = new Review({
        id: 1,
        author: mockUserInfo,
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

    let findAllReviewsMock: jest.Mock;
    let findByIdMock: jest.Mock;
    let findByAlbumIdMock: jest.Mock;
    let createReviewMock: jest.Mock;
    let editReviewMock: jest.Mock;
    let likeReviewMock: jest.Mock;
    let unlikeReviewMock: jest.Mock;
    let deleteReviewMock: jest.Mock;

    beforeEach(() => {
        findAllReviewsMock = jest.fn();
        findByIdMock = jest.fn();
        findByAlbumIdMock = jest.fn();
        createReviewMock = jest.fn();
        editReviewMock = jest.fn();
        likeReviewMock = jest.fn();
        unlikeReviewMock = jest.fn();
        deleteReviewMock = jest.fn();

        reviewDb.findAllReviews = findAllReviewsMock;
        reviewDb.findById = findByIdMock;
        reviewDb.findByAlbumId = findByAlbumIdMock;
        reviewDb.createReview = createReviewMock;
        reviewDb.editReview = editReviewMock;
        reviewDb.likeReview = likeReviewMock;
        reviewDb.unlikeReview = unlikeReviewMock;
        reviewDb.deleteReview = deleteReviewMock;
    });

    describe('getAllReviews', () => {
        test('should return all reviews', async () => {
            findAllReviewsMock.mockResolvedValue([mockReview]);

            await expect(reviewService.getAllReviews()).resolves.toEqual([mockReview]);
            expect(findAllReviewsMock).toHaveBeenCalled();
        });

        test('should propagate database errors', async () => {
            findAllReviewsMock.mockRejectedValue(new Error('DB Error'));

            await expect(reviewService.getAllReviews()).rejects.toThrow('DB Error');
        });
    });

    describe('getReviewById', () => {
        test('should return review by id', async () => {
            findByIdMock.mockResolvedValue(mockReview);

            await expect(reviewService.getReviewById(1)).resolves.toEqual(mockReview);
            expect(findByIdMock).toHaveBeenCalledWith(1);
        });

        test('should throw error if review not found', async () => {
            findByIdMock.mockResolvedValue(null);

            await expect(reviewService.getReviewById(999)).rejects.toThrow('review not found');
        });
    });

    describe('getAlbumReviews', () => {
        test('should return reviews for album', async () => {
            findByAlbumIdMock.mockResolvedValue([mockReview]);

            await expect(reviewService.getAlbumReviews('123')).resolves.toEqual([mockReview]);
            expect(findByAlbumIdMock).toHaveBeenCalledWith('123');
        });

        test('should throw error if no reviews found', async () => {
            findByAlbumIdMock.mockResolvedValue(null);

            await expect(reviewService.getAlbumReviews('999')).rejects.toThrow('no Reviews found for 999');
        });
    });

    describe('createReview', () => {
        test('should create review with valid input', async () => {
            createReviewMock.mockResolvedValue(mockReview);

            await expect(reviewService.createReview(mockReviewInput)).resolves.toEqual(mockReview);
            expect(createReviewMock).toHaveBeenCalledWith(
                expect.any(Review),
                mockReviewInput.authorId
            );
        });

        test('should propagate validation errors', async () => {
            const invalidInput = { ...mockReviewInput, starRating: 6 };

            await expect(reviewService.createReview(invalidInput))
                .rejects.toThrow('starRating should be between 0 and 5 inclusively');
        });
    });

    describe('editReview', () => {
        test('should edit review when user is author', async () => {
            findByIdMock.mockResolvedValue(mockReview);
            editReviewMock.mockResolvedValue(mockReview);

            await expect(
                reviewService.editReview(mockReviewInput, 1, 'testUser', 'user' as Role)
            ).resolves.toEqual(mockReview);
        });

        test('should edit review when user is admin', async () => {
            findByIdMock.mockResolvedValue(mockReview);
            editReviewMock.mockResolvedValue(mockReview);

            await expect(
                reviewService.editReview(mockReviewInput, 1, 'adminUser', 'admin' as Role)
            ).resolves.toEqual(mockReview);
        });

        test('should throw error when unauthorized user tries to edit', async () => {
            findByIdMock.mockResolvedValue(mockReview);

            await expect(
                reviewService.editReview(mockReviewInput, 1, 'otherUser', 'user' as Role)
            ).rejects.toThrow('you are not authorized to access this resource');
        });

        test('should throw error when review does not exist', async () => {
            findByIdMock.mockResolvedValue(null);

            await expect(
                reviewService.editReview(mockReviewInput, 999, 'testUser', 'user' as Role)
            ).rejects.toThrow("List Doesn't exist");
        });
    });

    describe('likeReview', () => {
        test('should like review when it exists', async () => {
            findByIdMock.mockResolvedValue(mockReview);
            likeReviewMock.mockResolvedValue(mockReview);

            await expect(reviewService.likeReview(1, 'testUser')).resolves.toEqual(mockReview);
            expect(likeReviewMock).toHaveBeenCalledWith(1, 'testUser');
        });

        test('should throw error when review does not exist', async () => {
            findByIdMock.mockResolvedValue(null);

            await expect(reviewService.likeReview(999, 'testUser'))
                .rejects.toThrow('Review Does not Exist');
        });
    });

    describe('unlikeReview', () => {
        test('should unlike review when it exists', async () => {
            findByIdMock.mockResolvedValue(mockReview);
            unlikeReviewMock.mockResolvedValue(mockReview);

            await expect(reviewService.unlikeReview(1, 'testUser')).resolves.toEqual(mockReview);
            expect(unlikeReviewMock).toHaveBeenCalledWith(1, 'testUser');
        });

        test('should throw error when review does not exist', async () => {
            findByIdMock.mockResolvedValue(null);

            await expect(reviewService.unlikeReview(999, 'testUser'))
                .rejects.toThrow('Review Does not Exist');
        });
    });

    describe('deleteReview', () => {
        test('should delete review', async () => {
            deleteReviewMock.mockResolvedValue(undefined);

            await expect(reviewService.deleteReview(1)).resolves.not.toThrow();
            expect(deleteReviewMock).toHaveBeenCalledWith(1);
        });

        test('should propagate deletion errors', async () => {
            deleteReviewMock.mockRejectedValue(new Error('DB Error'));

            await expect(reviewService.deleteReview(1)).rejects.toThrow('DB Error');
        });
    });
});