import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Request,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Roles } from 'src/authorization/roles.decorator';
import { AllUsers, UserDto } from './dto/all.users.dto';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto, @Request() request) {
    const user = request.user;
    const createdUser = await this.userService.create(createUserDto, user);
    if (createdUser instanceof Error) {
      throw new HttpException(createdUser.message, HttpStatus.BAD_REQUEST);
    }
    return { message: 'success', user: createdUser };
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: any): Promise<AllUsers> {
    const filters = {};
    const result = await this.userService.findAll(filters, query);
    return result;
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.getById(id);
    if (user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() request
  ) {
    const user = request.user;
    const updatedUser = await this.userService.update(id, updateUserDto, user);
    if (updatedUser === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const deletedUSer = await this.userService.remove(id);
    if (deletedUSer === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return deletedUSer;
  }
}
