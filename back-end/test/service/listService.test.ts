import { List } from '../../model/list';
import listService from '../../service/listService';
import listDb from '../../repository/list.db';
import { ListInput, Role, UserInfo } from '../../types';

describe('List Service', () => {
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

    const mockListInput: ListInput = {
        title: 'My Favorite Albums',
        description: 'A list of my favorite albums',
        albums: ['1', '2'],
        authorId: 1
    };

    const mockList = new List({
        id: 1,
        title: 'My Favorite Albums',
        description: 'A list of my favorite albums',
        albumIds: ['1', '2'],
        author: mockUserInfo,
        createdAt: new Date()
    });

    let getAllListsMock: jest.Mock;
    let getListByIdMock: jest.Mock;
    let getByIdMock: jest.Mock;
    let createListMock: jest.Mock;
    let editListMock: jest.Mock;
    let likeListMock: jest.Mock;
    let unlikeListMock: jest.Mock;
    let deleteListMock: jest.Mock;

    beforeEach(() => {
        getAllListsMock = jest.fn();
        getListByIdMock = jest.fn();
        getByIdMock = jest.fn();
        createListMock = jest.fn();
        editListMock = jest.fn();
        likeListMock = jest.fn();
        unlikeListMock = jest.fn();
        deleteListMock = jest.fn();

        listDb.getAllLists = getAllListsMock;
        listDb.getListById = getListByIdMock;
        listDb.getById = getByIdMock;
        listDb.createList = createListMock;
        listDb.editList = editListMock;
        listDb.likeList = likeListMock;
        listDb.unlikeList = unlikeListMock;
        listDb.deleteList = deleteListMock;
    });

    describe('getLists', () => {
        test('should return all lists', async () => {
            // Given
            getAllListsMock.mockResolvedValue([mockList]);

            // When
            const getLists = () => listService.getLists();

            // Then
            await expect(getLists()).resolves.toEqual([mockList]);
            expect(getAllListsMock).toHaveBeenCalled();
        });

        test('should propagate errors', async () => {
            // Given
            getAllListsMock.mockRejectedValue(new Error('DB Error'));

            // When
            const getLists = () => listService.getLists();

            // Then
            await expect(getLists()).rejects.toThrow('DB Error');
        });
    });

    describe('getListById', () => {
        test('should return list by id', async () => {
            // Given
            getListByIdMock.mockResolvedValue(mockList);

            // When
            const getList = () => listService.getListById(1);

            // Then
            await expect(getList()).resolves.toEqual(mockList);
            expect(getListByIdMock).toHaveBeenCalledWith(1);
        });

        test('should throw error if list not found', async () => {
            // Given
            getListByIdMock.mockResolvedValue(null);

            // When
            const getList = () => listService.getListById(999);

            // Then
            await expect(getList()).rejects.toThrow('List Not Found');
        });
    });

    describe('createList', () => {
        test('should create list with valid input', async () => {
            // Given
            createListMock.mockResolvedValue(mockList);

            // When
            const createList = () => listService.createList(mockListInput);

            // Then
            await expect(createList()).resolves.toEqual(mockList);
            expect(createListMock).toHaveBeenCalledWith(
                expect.any(List),
                mockListInput.authorId
            );
        });

        test('should throw error if input is invalid', async () => {
            // Given
            const invalidInput = { ...mockListInput, title: '' };

            // When
            const createList = () => listService.createList(invalidInput);

            // Then
            await expect(createList()).rejects.toThrow('title and description cannot be empty');
        });
    });

    describe('editList', () => {
        test('should edit list when user is author', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockList);
            editListMock.mockResolvedValue(mockList);

            // When
            const editList = () => listService.editList(mockListInput, 1, 'testUser', 'user' as Role);

            // Then
            await expect(editList()).resolves.toEqual(mockList);
            expect(editListMock).toHaveBeenCalledWith(expect.any(List), 1);
        });

        test('should edit list when user is admin', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockList);
            editListMock.mockResolvedValue(mockList);

            // When
            const editList = () => listService.editList(mockListInput, 1, 'adminUser', 'admin' as Role);

            // Then
            await expect(editList()).resolves.toEqual(mockList);
        });

        test('should throw error when unauthorized user tries to edit', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockList);

            // When
            const editList = () => listService.editList(mockListInput, 1, 'otherUser', 'user' as Role);

            // Then
            await expect(editList()).rejects.toThrow('you are not authorized to access this resource');
        });

        test('should throw error when list does not exist', async () => {
            // Given
            getByIdMock.mockResolvedValue(null);

            // When
            const editList = () => listService.editList(mockListInput, 999, 'testUser', 'user' as Role);

            // Then
            await expect(editList()).rejects.toThrow("List Doesn't exist");
        });
    });

    describe('likeList', () => {
        test('should like list when it exists', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockList);
            likeListMock.mockResolvedValue(mockList);

            // When
            const likeList = () => listService.likeList(1, 'testUser');

            // Then
            await expect(likeList()).resolves.toEqual(mockList);
            expect(likeListMock).toHaveBeenCalledWith(1, 'testUser');
        });

        test('should throw error when list does not exist', async () => {
            // Given
            getByIdMock.mockResolvedValue(null);

            // When
            const likeList = () => listService.likeList(999, 'testUser');

            // Then
            await expect(likeList()).rejects.toThrow("List Doesn't exist");
        });
    });

    describe('unlikeList', () => {
        test('should unlike list when it exists', async () => {
            // Given
            getByIdMock.mockResolvedValue(mockList);
            unlikeListMock.mockResolvedValue(mockList);

            // When
            const result = await listService.unlikeList(1, 'testUser');

            // Then
            expect(result).toEqual(mockList);
            expect(unlikeListMock).toHaveBeenCalledWith(1, 'testUser');
        });

        test('should throw error when list does not exist', async () => {
            // Given
            getByIdMock.mockResolvedValue(null);

            // When/Then
            await expect(
                listService.unlikeList(999, 'testUser')
            ).rejects.toThrow("List Doesn't exist");
        });
    });

    describe('deleteList', () => {
        test('should delete list', async () => {
            // Given
            deleteListMock.mockResolvedValue(undefined);

            // When
            const deleteList = () => listService.deleteList(1);

            // Then
            await expect(deleteList()).resolves.not.toThrow();
            expect(deleteListMock).toHaveBeenCalledWith(1);
        });

        test('should propagate deletion error', async () => {
            // Given
            deleteListMock.mockRejectedValue(new Error('DB Error'));

            // When
            const deleteList = () => listService.deleteList(1);

            // Then
            await expect(deleteList()).rejects.toThrow('DB Error');
        });
    });
});