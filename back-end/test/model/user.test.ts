import { User } from '../../model/user';
import { List } from '../../model/list';
import { Review } from '../../model/review';

describe('User Class', () => {
    const validUserData = {
        id: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345',
        lists: [],
        reviews: []
    };

    let user: User;
    let identicalUser: User;

    beforeEach(() => {
        user = new User(validUserData);
        identicalUser = new User(validUserData);
    });

    describe('Constructor and Validation', () => {
        test('should create user instance with valid data', () => {
            expect(user.getId()).toBe(1);
            expect(user.getEmail()).toBe('test@example.com');
            expect(user.getUsername()).toBe('testuser');
            expect(user.getPassword()).toBe('password12345');
            expect(user.getLists()).toEqual([]);
            expect(user.getReviews()).toEqual([]);
            expect(user.getCreatedAt()).toBeLessThanOrEqual(Date.now());
        });

        test('should throw error for invalid email format', () => {
            expect(() => {
                new User({
                    ...validUserData,
                    email: 'invalid-email'
                });
            }).toThrow('email is not valid');
        });

        test('should throw error for password shorter than 10 characters', () => {
            expect(() => {
                new User({
                    ...validUserData,
                    password: 'short'
                });
            }).toThrow('password is too short');
        });
    });

    describe('Getters', () => {
        test('should get id', () => {
            expect(user.getId()).toBe(1);
        });

        test('should get email', () => {
            expect(user.getEmail()).toBe('test@example.com');
        });

        test('should get username', () => {
            expect(user.getUsername()).toBe('testuser');
        });

        test('should get password', () => {
            expect(user.getPassword()).toBe('password12345');
        });

        test('should get empty lists array when no lists provided', () => {
            expect(user.getLists()).toEqual([]);
        });

        test('should get empty reviews array when no reviews provided', () => {
            expect(user.getReviews()).toEqual([]);
        });

        test('should get createdAt timestamp', () => {
            expect(typeof user.getCreatedAt()).toBe('number');
            expect(user.getCreatedAt()).toBeLessThanOrEqual(Date.now());
        });
    });

    describe('Setters', () => {
        test('should set valid email', () => {
            user.setEmail('newemail@example.com');
            expect(user.getEmail()).toBe('newemail@example.com');
        });

        test('should throw error when setting invalid email', () => {
            expect(() => {
                user.setEmail('invalid-email');
            }).toThrow('email is not valid');
        });

        test('should set username', () => {
            user.setUsername('newusername');
            expect(user.getUsername()).toBe('newusername');
        });

        test('should set valid password', () => {
            user.setPassword('newpassword12345');
            expect(user.getPassword()).toBe('newpassword12345');
        });

        test('should throw error when setting short password', () => {
            expect(() => {
                user.setPassword('short');
            }).toThrow('password is too short');
        });
    });

    describe('equals method', () => {
        test('should return true for identical users', () => {
            expect(user.equals(identicalUser)).toBeTruthy();
        });

        test('should return false for users with different IDs', () => {
            const differentUser = new User({
                ...validUserData,
                id: 2
            });
            expect(user.equals(differentUser)).toBeFalsy();
        });

        test('should return false for users with different emails', () => {
            const differentUser = new User({
                ...validUserData,
                email: 'different@example.com'
            });
            expect(user.equals(differentUser)).toBeFalsy();
        });

        test('should return false for users with different usernames', () => {
            const differentUser = new User({
                ...validUserData,
                username: 'differentuser'
            });
            expect(user.equals(differentUser)).toBeFalsy();
        });
    });

    describe('static from method', () => {
        test('should create User from Prisma data', () => {
            const prismaData = {
                id: 1,
                createdAt: new Date(),
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345',
                lists: [{
                    id: 1,
                    createdAt: new Date(),
                    title: 'Test List',
                    description: 'Test Description',
                    albumIds: ['1'],
                    authorId: 1,
                    author: {
                        id: 1,
                        createdAt: new Date(),
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password12345'
                    }
                }],
                reviews: []
            };

            const userFromPrisma = User.from(prismaData);
            expect(userFromPrisma).toBeInstanceOf(User);
            expect(userFromPrisma.getId()).toBe(prismaData.id);
            expect(userFromPrisma.getEmail()).toBe(prismaData.email);
            expect(userFromPrisma.getUsername()).toBe(prismaData.username);
            expect(userFromPrisma.getPassword()).toBe(prismaData.password);
            expect(userFromPrisma.getLists()[0]).toBeInstanceOf(List);
            expect(userFromPrisma.getReviews()).toEqual([]);
        });

        test('should handle empty lists and reviews in Prisma data', () => {
            const prismaData = {
                id: 1,
                createdAt: new Date(),
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345'
            };

            const userFromPrisma = User.from(prismaData);
            expect(userFromPrisma.getLists()).toEqual([]);
            expect(userFromPrisma.getReviews()).toEqual([]);
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
            expect(() => {
                new User({
                    ...validUserData,
                    email
                });
            }).not.toThrow();
        });

        test.each(invalidEmails)('should reject invalid email: %s', (email) => {
            expect(() => {
                new User({
                    ...validUserData,
                    email
                });
            }).toThrow('email is not valid');
        });
    });
});