// import { User } from './models/user.interface';
// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { Repository } from 'src/utils/handlers/repository';
// import { Model } from 'mongoose';

// describe('UserService', () => {
//   let service: UserService;
//   let repository: Model<User>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//         ConfigService,
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     repository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a new user', async () => {
//       const createUserDto = {
//         email: 'test@example.com',
//         password: 'testPassword',
//       };

//       const createdUser = {
//         _id: '123',
//         email: 'test@example.com',
//         password: 'testPassword',
//       };

//       jest.spyOn(repository, 'save').mockResolvedValue(createdUser);

//       const result = await service.create(createUserDto);

//       expect(result).toEqual(createdUser);
//       expect(repository.save).toHaveBeenCalledWith(createUserDto);
//     });
//   });

//   describe('findAll', () => {
//     it('should return all users', async () toEqual(allUsers);
//     expect(repository.find).toHaveBeenCalledWith({ where: filters, skip: query.skip, take: query.take });
//   });

//   describe('findOne', () => {
//     it('should find a user by id', async () => {
//       const id = '123';
//       const user = {
//         _id: '123',
//         email: 'test@example.com',
//         password: 'testPassword',
//       };

//       jest.spyOn(repository, 'findOne').mockResolvedValue(user);

//       const result = await service.findOne(id);

//       expect(result).toEqual(user);
//       expect(repository.findOne).toHaveBeenCalledWith(id);
//     });
//   });

//   describe('update', () => {
//     it('should update a user by id', async () => {
//       const id = '123';
//       const updateUserDto = {
//         email: 'updated@example.com',
//         password: 'updatedPassword',
//       };

//       const updatedUser = {
//         _id: '123',
//         email: 'updated@example.com',
//         password: 'updatedPassword',
//       };

//       jest.spyOn(repository, 'update').mockResolvedValue(updatedUser);

//       const result = await service.update(id, updateUserDto);

//       expect(result).toEqual(updatedUser);
//       expect(repository.update).toHaveBeenCalledWith(id, updateUserDto);
//     });
//   });

//   describe('remove', () => {
//     it('should remove a user by id', async () => {
//       const id = '123';

//       jest.spyOn(repository, 'deleteOne').mockResolvedValue({});

//       await service.remove(id);

//       expect(repository.deleteOne).toHaveBeenCalledWith(id);
//     });
//   });
// });
