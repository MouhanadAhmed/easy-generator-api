import { CreateUserDto } from './../user/dto/create-user.dto';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/tokenDto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'src/utils/handlers/repository';
import { Model } from 'mongoose';
import { User } from 'src/user/models/user.interface';
import { RecaptchaService } from './recaptcha.service';
import { SignupUserDto } from './dto/signup.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private repository: Repository,
    private recaptchaService: RecaptchaService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.findUser(loginDto);

    let loggedInUser = await this.repository.updateOne(
      this.userModel,
      user._id,
      {
        isActive: true,
        loggedOutAt: null,
      }
    );

    const { _id, email, name, role } = loggedInUser;
    const signingPayload = { _id, email, name, role };
    const JWT_KEY = this.configService.get('JWT_KEY');
    const jwt: string = sign(signingPayload, JWT_KEY, {
      expiresIn: '7d',
    });
    const userObj = loggedInUser.toObject();
    delete userObj.password;
    return { message: 'success', jwt, loggedInUser: userObj };
  }

  private async findUser(loginDto: LoginDto) {
    const user: any = await this.userService.findOne({ email: loginDto.email });
    if (!user) {
      throw new HttpException('incorrect email', 401);
    }

    const match: boolean = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!match) {
      throw new HttpException('incorrect email or password', 401);
    }
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async logOut(tokenDto: TokenDto) {
    if (!tokenDto || !tokenDto.token) {
      throw new HttpException('Please provide token', 401);
    }

    const decoded = this.jwtService.decode(tokenDto.token) as { _id: string };
    if (!decoded) {
      throw new HttpException('Invalid token', 401);
    }
    const user = await this.repository.updateOne(this.userModel, decoded._id, {
      isActive: false,
      loggedOutAt: new Date(),
    });
    if (!user) {
      throw new HttpException('Invalid user', 404);
    }
    const userObj = user.toObject();
    delete userObj.password;
    return { message: 'success', userObj };
  }

  async signUp(signupUserDto: SignupUserDto): Promise<User | Error> {
    // const isVerifiedRecaptcha = await this.recaptchaService.verifyRecaptcha(
    //   signupUserDto.recaptchaToken
    // );
    // if (isVerifiedRecaptcha !== true) {
    //   throw new HttpException(`ReCAPTCHA verification failed`, 400);
    // }
    const uniqueKey = { email: signupUserDto.email };
    if (await this.repository.doesDocumentExist(this.userModel, uniqueKey)) {
      throw new HttpException(
        `User already exists with same email ${signupUserDto.email}`,
        400
      );
    }

    const createdUser = await this.repository.addOne(
      this.userModel,
      signupUserDto,
      uniqueKey
    );

    const userObj = createdUser.toObject();
    delete userObj.password;
    return userObj;
  }
}
