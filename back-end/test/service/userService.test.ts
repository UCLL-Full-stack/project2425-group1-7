import userService from '../../service/userService';
import userDB from '../../repository/user.db';
import { User } from '../../model/user';
import { AuthResponse, UserInfo, UserInput, Role } from '../../types';
import * as bcrypt from 'bcrypt';
import { generateJWT } from '../../util/jwt';

jest.mock('bcrypt');
jest.mock('../../util/jwt', () => ({
    generateJWT: jest.fn()
}));

describe('User Service', () => {
    const mockUserInfo: UserInfo = {
        id: 1,
        username: 'testuser',
        role: 'user' as Role,
        isBlocked: false,
        createdAt: new Date(),
        reviews: [],
        lists: [],
        following: [],
        followedBy: []
    };

    const mockUser = new User({
        id: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword12345',
        role: 'user' as Role,
        isBlocked: false,
        lists: [],
        reviews: [],
        following: [],
        followedBy: []
    });

    const mockUserInput: UserInput = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345'
    };

    let findAllMock: jest.Mock;
    let findAllFunctionalMock: jest.Mock;
    let findByEmailMock: jest.Mock;
    let findByIdMock: jest.Mock;
    let registerUserMock: jest.Mock;
    let followUserMock: jest.Mock;
    let unfollowUserMock: jest.Mock;
    let promoteByIdMock: jest.Mock;
    let blockByIdMock: jest.Mock;

    beforeEach(() => {
        findAllMock = jest.fn();
        findAllFunctionalMock = jest.fn();
        findByEmailMock = jest.fn();
        findByIdMock = jest.fn();
        registerUserMock = jest.fn();
        followUserMock = jest.fn();
        unfollowUserMock = jest.fn();
        promoteByIdMock = jest.fn();
        blockByIdMock = jest.fn();

        userDB.findAll = findAllMock;
        userDB.findAllFunctional = findAllFunctionalMock;
        userDB.findByEmail = findByEmailMock;
        userDB.findById = findByIdMock;
        userDB.registerUser = registerUserMock;
        userDB.followUser = followUserMock;
        userDB.unfollowUser = unfollowUserMock;
        userDB.promoteById = promoteByIdMock;
        userDB.blockById = blockByIdMock;

        (bcrypt.compare as jest.Mock).mockClear();
        (bcrypt.hash as jest.Mock).mockClear();
        (generateJWT as jest.Mock).mockClear();
    });

    describe('getAllUsers', () => {
        test('should return all users including blocked for admin', async () => {
            findAllMock.mockResolvedValue([mockUser]);

            const result = await userService.getAllUsers('admin' as Role);

            expect(result).toEqual([mockUserInfo]);
            expect(findAllMock).toHaveBeenCalled();
        });

        test('should return only functional users for non-admin', async () => {
            findAllFunctionalMock.mockResolvedValue([mockUser]);

            const result = await userService.getAllUsers('user' as Role);

            expect(result).toEqual([mockUserInfo]);
            expect(findAllFunctionalMock).toHaveBeenCalled();
        });
    });

    describe('registerUser', () => {
        test('should throw error when email is already taken', async () => {
            // Given

            findByEmailMock.mockResolvedValue(new User({
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345f',
                role: 'user' as Role,
                isBlocked: false
            }));

            registerUserMock.mockRejectedValue(new Error('Should not be called'));

            // When/Then
            await expect(
                userService.registerUser({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password12345'
                })
            ).rejects.toThrow('user with Email test@example.com already exists');
        });

        test('should register new user when email is not taken', async () => {
            // Given
            findByEmailMock.mockRejectedValue(new Error('User not found'));

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            registerUserMock.mockResolvedValue(new User({
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedPassword',
                role: 'user' as Role,
                isBlocked: false,
                createdAt: new Date()
            }));

            // When
            const result = await userService.registerUser({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345'
            });

            // Then
            expect(result).toEqual({
                id: 1,
                username: 'testuser',
                role: 'user',
                createdAt: expect.any(Date)
            });
        });
    });

    describe('loginUser', () => {
        test('should login user with valid credentials', async () => {
            findByEmailMock.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateJWT as jest.Mock).mockReturnValue('mockToken');

            const result = await userService.loginUser(mockUserInput);

            expect(result).toEqual({
                token: 'mockToken',
                id: mockUser.getId(),
                username: mockUser.getUsername(),
                role: mockUser.getRole(),
                isBlocked: mockUser.getIsBlocked()
            });
        });

        test('should throw error for invalid credentials', async () => {
            findByEmailMock.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.loginUser(mockUserInput))
                .rejects.toThrow('Invalid Credentials');
        });
    });

    describe('followUser', () => {
        test('should follow user successfully', async () => {
            followUserMock.mockResolvedValue(mockUser);

            const result = await userService.followUser(1, 'testuser');

            expect(result).toBe(mockUser.getId());
            expect(followUserMock).toHaveBeenCalledWith(1, 'testuser');
        });
    });

    describe('unfollowUser', () => {
        test('should unfollow user successfully', async () => {
            unfollowUserMock.mockResolvedValue(mockUser);

            const result = await userService.unfollowUser(1, 'testuser');

            expect(result).toBe(mockUser.getId());
            expect(unfollowUserMock).toHaveBeenCalledWith(1, 'testuser');
        });
    });

    describe('promoteUser', () => {
        test('should promote user when admin requests', async () => {
            // Given
            findByIdMock.mockResolvedValue(mockUser);
            const promotedUser = new User({
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345',
                role: 'moderator' as Role,
                isBlocked: false,
                createdAt: new Date()
            });
            promoteByIdMock.mockResolvedValue(promotedUser);

            // When
            const result = await userService.promoteUser(1, 'admin' as Role);

            // Then
            expect(result).toEqual({
                id: promotedUser.getId(),
                username: promotedUser.getUsername(),
                role: promotedUser.getRole(),
                isBlocked: promotedUser.getIsBlocked(),
                createdAt: promotedUser.getCreatedAt(),
                reviews: promotedUser.getReviews(),
                lists: promotedUser.getLists()
            });
            expect(promoteByIdMock).toHaveBeenCalledWith(1, 'moderator');
        });

        test('should throw error when non-admin tries to promote', async () => {
            await expect(
                userService.promoteUser(1, 'user' as Role)
            ).rejects.toThrow('You are not authorized to access this resource');
        });
    });

    describe('blockUser', () => {
        test('should toggle user block status when admin requests', async () => {
            // Given
            const initialUser = new User({
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345',
                role: 'user' as Role,
                isBlocked: false,
                createdAt: new Date()
            });

            const blockedUser = new User({
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                password: 'password12345',
                role: 'user' as Role,
                isBlocked: true,
                createdAt: new Date()
            });

            findByIdMock.mockResolvedValue(initialUser);
            blockByIdMock.mockResolvedValue(blockedUser);

            // When
            const result = await userService.blockUser(1, 'admin' as Role);

            // Then
            expect(result).toEqual({
                id: blockedUser.getId(),
                username: blockedUser.getUsername(),
                role: blockedUser.getRole(),
                isBlocked: blockedUser.getIsBlocked(),
                createdAt: blockedUser.getCreatedAt(),
                reviews: blockedUser.getReviews(),
                lists: blockedUser.getLists()
            });
            expect(blockByIdMock).toHaveBeenCalledWith(1, false);
        });

        test('should throw error when non-admin tries to block', async () => {
            await expect(
                userService.blockUser(1, 'user' as Role)
            ).rejects.toThrow('You are not authorized to access this resource');
        });
    });
});