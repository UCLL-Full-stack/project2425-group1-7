import { List } from '../../model/list';
import { UserInfo } from '../../types';

describe('List Class', () => {
  // Create mock UserInfo instead of User instance
  const mockUserInfo: UserInfo = {
    id: 1,
    email: 'test@test.com',
    username: 'testUser'
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

  let list: List;
  let identicalList: List;

  beforeEach(() => {
    list = new List(validListData);
    identicalList = new List(validListData);
  });

  describe('Constructor and Validation', () => {
    test('should create a list instance with all properties', () => {
      expect(list.getId()).toBe(1);
      expect(list.getTitle()).toBe('Favorite Albums');
      expect(list.getDescription()).toBe('A list of my favorite albums');
      expect(list.getAlbums()).toEqual(['1', '2', '3']);
      expect(list.getLikes()).toEqual([1, 2]);
      expect(list.getAuthor()).toEqual(mockUserInfo);
      expect(list.getCreatedAt()).toBeInstanceOf(Date);
    });

    test('should throw error if title is empty', () => {
      expect(() => {
        new List({
          ...validListData,
          title: ''
        });
      }).toThrow('title and description cannot be empty');
    });

    test('should throw error if description is empty', () => {
      expect(() => {
        new List({
          ...validListData,
          description: ''
        });
      }).toThrow('title and description cannot be empty');
    });

    test('should throw error if albumIds array is empty', () => {
      expect(() => {
        new List({
          ...validListData,
          albumIds: []
        });
      }).toThrow('list albumIds cannot be empty');
    });
  });

  // Getters tests remain the same except for author test
  describe('Getters', () => {
    test('should get title', () => {
      expect(list.getTitle()).toBe('Favorite Albums');
    });

    test('should get description', () => {
      expect(list.getDescription()).toBe('A list of my favorite albums');
    });

    test('should get albumIds', () => {
      expect(list.getAlbums()).toEqual(['1', '2', '3']);
    });

    test('should get likes', () => {
      expect(list.getLikes()).toEqual([1, 2]);
    });

    test('should get author', () => {
      expect(list.getAuthor()).toEqual(mockUserInfo);
    });

    test('should get createdAt', () => {
      expect(list.getCreatedAt()).toBeInstanceOf(Date);
    });
  });

  // equals method tests remain the same
  describe('equals method', () => {
    test('should return true for identical lists', () => {
      expect(list.equals(identicalList)).toBeTruthy();
    });

    test('should return false for lists with different titles', () => {
      const differentList = new List({
        ...validListData,
        title: 'Different Title'
      });
      expect(list.equals(differentList)).toBeFalsy();
    });

    test('should return false for lists with different descriptions', () => {
      const differentList = new List({
        ...validListData,
        description: 'Different description'
      });
      expect(list.equals(differentList)).toBeFalsy();
    });

    test('should return false for lists with different albumIds', () => {
      const differentList = new List({
        ...validListData,
        albumIds: ['4', '5', '6']
      });
      expect(list.equals(differentList)).toBeFalsy();
    });
  });

  describe('static from method', () => {
    test('should create List from Prisma data', () => {
      const prismaData = {
        id: 1,
        createdAt: new Date(),
        title: 'Favorite Albums',
        description: 'A list of my favorite albums',
        albumIds: ['1', '2', '3'],
        authorId: 1,
        author: {
          id: 1,
          createdAt: new Date(),
          email: 'test@test.com',
          username: 'testUser',
          password: 'password12345'
        },
        likes: [
          {
            id: 1,
            createdAt: new Date(),
            email: 'liker1@test.com',
            username: 'liker1',
            password: 'password12345'
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
        email: prismaData.author.email,
        username: prismaData.author.username
      });
    });
  });
});