import { User } from '../../model/user';
import { List } from '../../model/list';
import { Review } from '../../model/review';
import { Role } from '../../types';

describe('User Class', () => {
    const validUserData = {
        id: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345',
        role: 'user' as Role,
        isBlocked: false,
        lists: [],
        reviews: [],
        followedBy: [],
        following: []
    };

    describe('Constructor and Validation', () => {
        test('should create user instance with valid data', () => {
            const createValidUser = () => new User(validUserData);
            const user = createValidUser();

            expect(user.getId()).toBe(validUserData.id);
            expect(user.getEmail()).toBe(validUserData.email);
            expect(user.getUsername()).toBe(validUserData.username);
            expect(user.getPassword()).toBe(validUserData.password);
            expect(user.getRole()).toBe(validUserData.role);
            expect(user.getIsBlocked()).toBe(validUserData.isBlocked);
            expect(user.getLists()).toEqual(validUserData.lists);
            expect(user.getReviews()).toEqual(validUserData.reviews);
            expect(user.getFollowers()).toEqual(validUserData.followedBy);
            expect(user.getFollowing()).toEqual(validUserData.following);
            expect(user.getCreatedAt()).toBe(validUserData.createdAt);
        });

        test('should throw error for invalid email format', () => {
            const createInvalidUser = () => new User({
                ...validUserData,
                email: 'invalid-email'
            });

            expect(createInvalidUser).toThrowError('email is not valid');
        });

        test('should throw error for password shorter than 10 characters', () => {
            const createInvalidUser = () => new User({
                ...validUserData,
                password: 'short'
            });

            expect(createInvalidUser).toThrowError('password is too short');
        });
    });

    describe('Setters', () => {
        test('should set valid email', () => {
            const user = new User(validUserData);
            user.setEmail('newemail@example.com');
            expect(user.getEmail()).toBe('newemail@example.com');
        });

        test('should throw error when setting invalid email', () => {
            const user = new User(validUserData);
            expect(() => user.setEmail('invalid-email')).toThrowError('email is not valid');
        });

        test('should set username', () => {
            const user = new User(validUserData);
            user.setUsername('newusername');
            expect(user.getUsername()).toBe('newusername');
        });

        test('should set valid password', () => {
            const user = new User(validUserData);
            user.setPassword('newpassword12345');
            expect(user.getPassword()).toBe('newpassword12345');
        });

        test('should throw error when setting short password', () => {
            const user = new User(validUserData);
            expect(() => user.setPassword('short')).toThrowError('password is too short');
        });
    });

    describe('equals method', () => {
        test('should return true for identical users', () => {
            const user1 = new User(validUserData);
            const user2 = new User(validUserData);
            expect(user1.equals(user2)).toBeTruthy();
        });

        test('should return false for different users', () => {
            const user1 = new User(validUserData);
            const user2 = new User({
                ...validUserData,
                email: 'different@example.com'
            });
            expect(user1.equals(user2)).toBeFalsy();
        });
    });

    describe('static from method', () => {
        test('should create User from Prisma data', () => {
            const createdAt = new Date();
            const prismaData = {
                id: 1,
                createdAt: createdAt,
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345',
                role: 'user' as Role,
                isBlocked: false,
                lists: [{
                    id: 1,
                    createdAt: createdAt,
                    title: 'Test List',
                    description: 'Test Description',
                    albumIds: ['1'],
                    authorId: 1,
                    author: {
                        id: 1,
                        createdAt: createdAt,
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password12345',
                        role: 'user' as Role,
                        isBlocked: false
                    }
                }],
                reviews: [{
                    id: 1,
                    createdAt: createdAt,
                    title: 'Test Review',
                    body: 'Test Body',
                    starRating: 5,
                    albumID: '1',
                    authorId: 1,
                    author: {
                        id: 1,
                        createdAt: createdAt,
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password12345',
                        role: 'user' as Role,
                        isBlocked: false
                    },
                    comments: []
                }],
                followedBy: [{
                    id: 2,
                    createdAt: createdAt,
                    email: 'follower@example.com',
                    username: 'follower',
                    password: 'password12345',
                    role: 'user' as Role,
                    isBlocked: false
                }],
                following: [{
                    id: 3,
                    createdAt: createdAt,
                    email: 'following@example.com',
                    username: 'following',
                    password: 'password12345',
                    role: 'user' as Role,
                    isBlocked: false
                }]
            };

            const userFromPrisma = User.from(prismaData);

            expect(userFromPrisma).toBeInstanceOf(User);
            expect(userFromPrisma.getId()).toBe(prismaData.id);
            expect(userFromPrisma.getEmail()).toBe(prismaData.email);
            expect(userFromPrisma.getUsername()).toBe(prismaData.username);
            expect(userFromPrisma.getPassword()).toBe(prismaData.password);
            expect(userFromPrisma.getRole()).toBe(prismaData.role);
            expect(userFromPrisma.getIsBlocked()).toBe(prismaData.isBlocked);
            expect(userFromPrisma.getLists()[0]).toBeInstanceOf(List);
            expect(userFromPrisma.getReviews()[0]).toBeInstanceOf(Review);
            expect(userFromPrisma.getFollowers()).toEqual([2]);
            expect(userFromPrisma.getFollowing()).toEqual([3]);
        });
    });

    describe('Email Validation', () => {
        const validEmails = [
            'test@example.com',
            'user.name@domain.com',
            'user-name@domain.com',
            'username123@sub.domain.com'
        ];

        const invalidEmails = [
            'invalid-email',
            'test@',
            '@domain.com',
            'test@domain',
            'test@.com',
            'test@domain.'
        ];

        test.each(validEmails)('should accept valid email: %s', (email) => {
            const createUser = () => new User({...validUserData, email});
            expect(createUser).not.toThrow();
        });

        test.each(invalidEmails)('should reject invalid email: %s', (email) => {
            const createUser = () => new User({...validUserData, email});
            expect(createUser).toThrow('email is not valid');
        });
    });
});