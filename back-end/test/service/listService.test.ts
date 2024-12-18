import { List } from '../../model/list';
import listService from '../../service/listService';
import listDb from '../../repository/list.db';
import { ListInput } from '../../types';
import { User } from '../../model/user';
import { UserInfo } from '../../types';

const mockUser = new User({
    id: 1,
    createdAt: new Date(),
    email: 'test@test.com',
    username: 'testUser',
    password: 'password12345',
    lists: [],
    reviews: []
});

const mockUserInfo: UserInfo = {
    id: 1,
    email: 'test@test.com',
    username: 'testUser'
}

const mockListInput: ListInput = {
    title: 'My Favorite Albums',
    description: 'A list of my favorite albums',
    albums: ['1', '2'],
    authorId: mockUser.getId()
};

const mockList = new List({
    id: 1,
    title: 'My Favorite Albums',
    description: 'A list of my favorite albums',
    albumIds: ['1', '2'],
    author: mockUserInfo,
    createdAt: new Date()
});

// Setup mocks
let getAllListsMock: jest.Mock;
let getListByIdMock: jest.Mock;
let createListMock: jest.Mock;
let getUserListsMock: jest.Mock;
let likeListMock: jest.Mock;
let deleteListMock: jest.Mock;

beforeEach(() => {
    getAllListsMock = jest.fn();
    getListByIdMock = jest.fn();
    createListMock = jest.fn();
    getUserListsMock = jest.fn();
    likeListMock = jest.fn();
    deleteListMock = jest.fn();

    // Setup db mocks
    listDb.getAllLists = getAllListsMock;
    listDb.getListById = getListByIdMock;
    listDb.createList = createListMock;
    listDb.getUserLists = getUserListsMock;
    listDb.likeList = likeListMock;
    listDb.deleteList = deleteListMock;
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('List Service', () => {
    describe('getLists', () => {
        test('should return all lists', async () => {
            // Given
            getAllListsMock.mockResolvedValue([mockList]);

            // When
            const lists = await listService.getLists();

            // Then
            expect(getAllListsMock).toHaveBeenCalled();
            expect(lists).toEqual([mockList]);
        });

        test('should handle db error', async () => {
            // Given
            getAllListsMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(listService.getLists()).rejects.toThrow('DB Error');
        });
    });

    describe('getListById', () => {
        test('should return list by id', async () => {
            // Given
            getListByIdMock.mockResolvedValue(mockList);

            // When
            const list = await listService.getListById(1);

            // Then
            expect(getListByIdMock).toHaveBeenCalledWith(1);
            expect(list).toEqual(mockList);
        });

        test('should throw error if list not found', async () => {
            // Given
            getListByIdMock.mockResolvedValue(null);

            // Then
            await expect(listService.getListById(999))
                .rejects
                .toThrow('List Not Found');
        });
    });

    describe('getUserLists', () => {
        test('should return lists for user', async () => {
            // Given
            getUserListsMock.mockResolvedValue([mockList]);

            // When
            const lists = await listService.getUserLists(1);

            // Then
            expect(getUserListsMock).toHaveBeenCalledWith(1);
            expect(lists).toEqual([mockList]);
        });
    });

    describe('createList', () => {
        test('should create list with valid input', async () => {
            // Given
            createListMock.mockResolvedValue(mockList);

            // When
            const result = await listService.createList(mockListInput);

            // Then
            expect(createListMock).toHaveBeenCalledWith(
                expect.any(List),
                mockListInput.authorId
            );
            expect(result).toEqual(mockList);
        });

        test('should throw error if list input is invalid', async () => {
            // Given
            const invalidInput = {
                ...mockListInput,
                title: ''
            };

            // Then
            await expect(listService.createList(invalidInput))
                .rejects
                .toThrow('title and description cannot be empty');
        });
    });

    describe('likeList', () => {
        test('should update list likes', async () => {
            // Given
            const newLikes = [1, 2, 3];
            likeListMock.mockResolvedValue({...mockList, likes: newLikes});

            // When
            await listService.likeList(1, newLikes);

            // Then
            expect(likeListMock).toHaveBeenCalledWith(1, newLikes);
        });
    });

    describe('deleteList', () => {
        test('should delete list', async () => {
            // Given
            deleteListMock.mockResolvedValue(undefined);

            // When
            await listService.deleteList(1);

            // Then
            expect(deleteListMock).toHaveBeenCalledWith(1);
        });

        test('should handle deletion error', async () => {
            // Given
            deleteListMock.mockRejectedValue(new Error('DB Error'));

            // Then
            await expect(listService.deleteList(1))
                .rejects
                .toThrow('DB Error');
        });
    });
});