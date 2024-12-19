import { List } from '../../model/list';
import { Role, UserInfo } from '../../types';

describe('List Class', () => {
  const mockUserInfo: UserInfo = {
    id: 1,
    username: 'testUser',
    role: 'user' as Role,
    createdAt: new Date(),
    isBlocked: false
  };

  const validListData = {
    id: 1,
    title: 'Favorite Albums',
    description: 'A list of my favorite albums',
    albumIds: ['1', '2', '3'],
    author: mockUserInfo,
    likes: [1, 2],
    createdAt: new Date()
  };

  describe('Constructor and Validation', () => {
    test('should create a list instance with all properties', () => {
      const list = new List(validListData);

      expect(list.getId()).toBe(validListData.id);
      expect(list.getTitle()).toBe(validListData.title);
      expect(list.getDescription()).toBe(validListData.description);
      expect(list.getAlbums()).toEqual(validListData.albumIds);
      expect(list.getLikes()).toEqual(validListData.likes);
      expect(list.getAuthor()).toEqual(mockUserInfo);
      expect(list.getCreatedAt()).toBe(validListData.createdAt);
    });

    test('should throw error if title is empty', () => {
      const createInvalidList = () => new List({
        ...validListData,
        title: ''
      });

      expect(createInvalidList).toThrowError('title and description cannot be empty');
    });

    test('should throw error if description is empty', () => {
      const createInvalidList = () => new List({
        ...validListData,
        description: ''
      });

      expect(createInvalidList).toThrowError('title and description cannot be empty');
    });

    test('should throw error if albumIds array is empty', () => {
      const createInvalidList = () => new List({
        ...validListData,
        albumIds: []
      });

      expect(createInvalidList).toThrowError('list albumIds cannot be empty');
    });
  });

  describe('Getters', () => {
    let list: List;

    beforeEach(() => {
      list = new List(validListData);
    });

    test('should get title', () => {
      expect(list.getTitle()).toBe(validListData.title);
    });

    test('should get description', () => {
      expect(list.getDescription()).toBe(validListData.description);
    });

    test('should get albumIds', () => {
      expect(list.getAlbums()).toEqual(validListData.albumIds);
    });

    test('should get likes', () => {
      expect(list.getLikes()).toEqual(validListData.likes);
    });

    test('should get author', () => {
      expect(list.getAuthor()).toEqual(mockUserInfo);
    });

    test('should get createdAt', () => {
      expect(list.getCreatedAt()).toBe(validListData.createdAt);
    });
  });

  describe('equals method', () => {
    test('should return true for identical lists', () => {
      const list1 = new List(validListData);
      const list2 = new List(validListData);
      expect(list1.equals(list2)).toBeTruthy();
    });

    test('should return false for lists with different titles', () => {
      const list1 = new List(validListData);
      const list2 = new List({
        ...validListData,
        title: 'Different Title'
      });
      expect(list1.equals(list2)).toBeFalsy();
    });

    test('should return false for lists with different descriptions', () => {
      const list1 = new List(validListData);
      const list2 = new List({
        ...validListData,
        description: 'Different description'
      });
      expect(list1.equals(list2)).toBeFalsy();
    });

    test('should return false for lists with different albumIds', () => {
      const list1 = new List(validListData);
      const list2 = new List({
        ...validListData,
        albumIds: ['4', '5', '6']
      });
      expect(list1.equals(list2)).toBeFalsy();
    });
  });

  describe('static from method', () => {
    test('should create List from Prisma data', () => {
      const createdAt = new Date();
      const prismaData = {
        id: 1,
        createdAt: createdAt,
        title: 'Favorite Albums',
        description: 'A list of my favorite albums',
        albumIds: ['1', '2', '3'],
        authorId: 1,
        author: {
          id: 1,
          createdAt: createdAt,
          email: 'test@example.com',
          username: 'testUser',
          password: 'password12345',
          role: 'user',
          isBlocked: false
        },
        likes: [
          {
            id: 1,
            createdAt: createdAt,
            email: 'liker1@test.com',
            username: 'liker1',
            password: 'password12345',
            role: 'user',
            isBlocked: false
          }
        ]
      };

      const listFromPrisma = List.from(prismaData);

      expect(listFromPrisma).toBeInstanceOf(List);
      expect(listFromPrisma.getId()).toBe(prismaData.id);
      expect(listFromPrisma.getTitle()).toBe(prismaData.title);
      expect(listFromPrisma.getDescription()).toBe(prismaData.description);
      expect(listFromPrisma.getAlbums()).toEqual(prismaData.albumIds);
      expect(listFromPrisma.getLikes()).toEqual([1]);
      expect(listFromPrisma.getAuthor()).toEqual({
        id: prismaData.author.id,
        username: prismaData.author.username,
        role: prismaData.author.role as Role,
        createdAt: prismaData.author.createdAt,
        isBlocked: prismaData.author.isBlocked
      });
      expect(listFromPrisma.getCreatedAt()).toBe(prismaData.createdAt);
    });
  });
});