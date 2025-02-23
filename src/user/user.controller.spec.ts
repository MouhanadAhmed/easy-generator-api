// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';

// describe('UserController', () => {
//   let controller: UserController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return success message', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
        displayName: 'Test User',
      };
      const createdUser = {
        id: '1',
        ...createUserDto,
      };

      mockUserService.create.mockResolvedValue(createdUser);

      expect(await controller.create(createUserDto)).toEqual({
        message: 'success',
        user: createdUser,
      });
    });

    it('should throw an exception if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
        displayName: 'Test User',
      };

      mockUserService.create.mockResolvedValue(null);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const query = { limit: 10, offset: 0 };
      const result = [
        { id: '1', email: 'test1@example.com', displayName: 'Test User 1' },
      ];

      mockUserService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(query)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = {
        id: userId,
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockUserService.findOne.mockResolvedValue(user);

      expect(await controller.findOne(userId)).toBe(user);
    });

    it('should throw an exception if user not found', async () => {
      const userId = '1';

      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { displayName: 'Updated User' };
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        displayName: 'Updated User',
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      expect(await controller.update(userId, updateUserDto)).toBe(updatedUser);
    });

    it('should throw an exception if user not found', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { displayName: 'Updated User' };

      mockUserService.update.mockResolvedValue(null);

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('remove', () => {
    it('should delete a user and return the deleted user', async () => {
      const userId = '1';
      const deletedUser = {
        id: userId,
        email: 'test@example.com',
        displayName: 'Deleted User',
      };

      mockUserService.remove.mockResolvedValue(deletedUser);

      expect(await controller.remove(userId)).toBe(deletedUser);
    });

    it('should throw an exception if user not found', async () => {
      const userId = '1';

      mockUserService.remove.mockResolvedValue(null);

      await expect(controller.remove(userId)).rejects.toThrow(HttpException);
    });
  });
});
