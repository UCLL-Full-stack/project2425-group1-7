import userService from '../../service/userService';
import userDB from '../../repository/user.db';
import { User } from '../../model/user';
import { AuthResponse, UserInput } from '../../types';
import * as bcrypt from 'bcrypt';
import { generateJWT } from '../../util/jwt';

jest.mock('bcrypt');
jest.mock('../../util/jwt', () => ({
    generateJWT: jest.fn()
}));

const mockUser = new User({
    id: 1,
    createdAt: new Date(),
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword12345',
    lists: [],
    reviews: []
});

const mockUserInput: UserInput = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password12345'
};

let findByEmailMock: jest.Mock;
let findByIdMock: jest.Mock;
let registerUserMock: jest.Mock;

beforeEach(() => {
    findByEmailMock = jest.fn();
    findByIdMock = jest.fn();
    registerUserMock = jest.fn();

    userDB.findByEmail = findByEmailMock;
    userDB.findById = findByIdMock;
    userDB.registerUser = registerUserMock;

    (bcrypt.compare as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockClear();
    (generateJWT as jest.Mock).mockClear();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('User Service', () => {
    describe('registerUser', () => {
        test('should register new user with valid input', async () => {
            // Given
            findByEmailMock.mockRejectedValue(new Error('User not found'));
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            registerUserMock.mockResolvedValue(mockUser);

            // When
            const result = await userService.registerUser(mockUserInput);

            // Then
            expect(findByEmailMock).toHaveBeenCalledWith(mockUserInput.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 12);
            expect(registerUserMock).toHaveBeenCalledWith({
                email: mockUserInput.email,
                username: mockUserInput.username,
                password: 'hashedPassword'
            });
            expect(result).toEqual(mockUser);
        });

        test('should throw error if user with email already exists', async () => {
            // Given
            findByEmailMock.mockResolvedValue(mockUser);

            // When & Then
            await expect(userService.registerUser(mockUserInput))
                .rejects
                .toThrow(`user with Email ${mockUserInput.email} already exists`);

            expect(findByEmailMock).toHaveBeenCalledWith(mockUserInput.email);
        });

        test('should throw error if email is empty', async () => {
            await expect(userService.registerUser({
                ...mockUserInput,
                email: ''
            })).rejects.toThrow("user fields can't be null");
        });

        test('should throw error if username is empty', async () => {
            await expect(userService.registerUser({
                ...mockUserInput,
                username: ''
            })).rejects.toThrow("user fields can't be null");
        });

        test('should throw error if password is empty', async () => {
            await expect(userService.registerUser({
                ...mockUserInput,
                password: ''
            })).rejects.toThrow("user fields can't be null");
        });
    });

    describe('loginUser', () => {
        test('should login user with valid credentials', async () => {
            findByEmailMock.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateJWT as jest.Mock).mockReturnValue('mockToken');

            const expectedAuthResponse: AuthResponse = {
                token: 'mockToken',
                email: mockUser.getEmail(),
                id: mockUser.getId(),
                username: mockUser.getUsername()
            };

            const result = await userService.loginUser(mockUserInput);

            expect(findByEmailMock).toHaveBeenCalledWith(mockUserInput.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockUserInput.password, mockUser.getPassword());
            expect(generateJWT).toHaveBeenCalledWith(
                mockUser.getEmail(),
                mockUser.getId(),
                mockUser.getUsername()
            );
            expect(result).toEqual(expectedAuthResponse);
        });

        test('should throw error if user not found', async () => {
            findByEmailMock.mockRejectedValue(new Error('User not found'));

            await expect(userService.loginUser(mockUserInput))
                .rejects
                .toThrow('User not found');
        });

        test('should throw error if password is incorrect', async () => {
            findByEmailMock.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.loginUser(mockUserInput))
                .rejects
                .toThrow('Invalid Credentials');
        });
    });

    describe('getByEmail', () => {
        test('should return user by email', async () => {
            findByEmailMock.mockResolvedValue(mockUser);

            const result = await userService.getByEmail('test@example.com');

            expect(findByEmailMock).toHaveBeenCalledWith('test@example.com');
            expect(result).toEqual(mockUser);
        });

        test('should throw error if user not found', async () => {
            findByEmailMock.mockRejectedValue(new Error('User not found'));

            await expect(userService.getByEmail('nonexistent@example.com'))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('getById', () => {
        test('should return user by id', async () => {
            findByIdMock.mockResolvedValue(mockUser);

            const result = await userService.getById(1);

            expect(findByIdMock).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockUser);
        });

        test('should throw error if user not found', async () => {
            findByIdMock.mockRejectedValue(new Error('User not found'));

            await expect(userService.getById(999))
                .rejects
                .toThrow('User not found');
        });
    });
});
