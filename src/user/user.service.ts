import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.interface';
import { Repository } from 'src/utils/handlers/repository';
import { plainToInstance } from 'class-transformer';
import { AllUsers, UserDto } from './dto/all.users.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private repository: Repository
  ) {}
  async create(
    createUserDto: CreateUserDto,
    user: User
  ): Promise<User | Error> {
    const uniqueKey = { email: createUserDto.email };
    if (await this.repository.doesDocumentExist(this.userModel, uniqueKey)) {
      return Error(
        `User already exists with same email ${createUserDto.email}`
      );
    }
    const userData = plainToInstance(CreateUserDto, createUserDto);

    const createdUser = await this.repository.addOne(
      this.userModel,
      userData,
      uniqueKey
    );
    return createdUser;
  }
  async findAll(filters: object, query: any): Promise<AllUsers> {
    const result = await this.repository.getAll(this.userModel, filters, query);
    const sanitizedUsers = result.documents.map((user: User) => {
      const userObj = user.toObject() as User;
      const { password, ...userWithoutPassword } = userObj;
      return userWithoutPassword as UserDto;
    });
    return {
      page: result.page,
      pages: result.pages,
      count: result.count,
      pageLength: result.pageLength,
      users: sanitizedUsers,
    };
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.repository.getById(this.userModel, id);
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword as UserDto;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: User) {
    const userData = plainToInstance(UpdateUserDto, updateUserDto);

    const userUpdated = await this.repository.updateOne(
      this.userModel,
      id,
      userData
    );
    const userObj = userUpdated.toObject();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword as UserDto;
  }

  remove(id: string): Promise<User> {
    return this.repository.deleteOne(this.userModel, id);
  }

  findOne(uniqueKey: any): Promise<User> {
    return this.repository.findOne(this.userModel, uniqueKey);
  }
}
