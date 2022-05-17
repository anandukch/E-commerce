import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'src/shared/response';
import { LoginDto } from './dto/login.dto';
import { Otp } from 'src/schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAILER } from 'src/shared/Mailer';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginDto) {
    try {
      const userData = await this.userService.findUser({
        username: user.username.toLowerCase(),
      });

      if (!userData) {
        throw new UnauthorizedException('User does not exist');
      }

      const matchedPassword = await bcrypt.compare(
        user.password,
        userData.password,
      );

      if (!matchedPassword) {
        throw new UnauthorizedException('Password does not match');
      }

      const payload = {
        username: userData.username,
        systemId: userData.systemId,
        role: userData.role,
        timestamp: userData.createdOn,
      };

      const token = this.jwtService.sign(payload);
      return new Response({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            systemId: userData.systemId,
            username: userData.username,
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            createdOn: userData.createdOn,
            contactNumber: userData.contactNumber,
            address: userData.address,
          },
          authenticationToken: token,
        },
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async generateOtp(userData) {
    const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const user = await this.userService.findUser({
      username: userData.username.toLowerCase(),
    });
    console.log(user)
    if (!user) {
      return new Response({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    await this.otpModel.create({
      otp: otp,
      username: user.username,
    });
    MAILER.sendMailWithOTPForResetPassword({ email: userData.username }, otp);
    return new Response({
      success: true,
      message: 'Otp sent',
      data: otp,
    });
  }

  async verifyOTP(userData) {
    const otp = await this.otpModel.findOne({
      username: userData.username,
      otp: userData.otp,
    });
    await this.otpModel.deleteOne({
      username: userData.username,
      otp: userData.otp,
    });
    if (!otp) {
      return new Response({
        success: false,
        message: 'Otp not matched',
        data: null,
      });
    }

    const token = this.jwtService.sign({
      username: userData.username,
      systemId: userData.systemId,
      role: userData.role,
    });

    return new Response({
      success: true,
      message: 'Otp verified',
      data: {
        authToken: token,
      },
    });
  }

  async resetPassword(userData, user: any) {
    const userToUpdate = await this.userService.findUser(user);
    if (!userToUpdate) {
      return new Response({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    const password = userData.password;
    if (password.length <= 6) {
      return new Response({
        success: false,
        message: 'Password must be atleast 6 characters long',
        data: null,
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    // userToUpdate.password=hashedPassword;
    await this.userService.update({password:hashedPassword},user);
    return new Response({
      success: true,
      message: 'Password reset successfully',
      data: {
        user: {
          systemId: userToUpdate.systemId,
          username: userToUpdate.username,
          role: userToUpdate.role,
          firstName: userToUpdate.firstName,
          lastName: userToUpdate.lastName,
          createdOn: userToUpdate.createdOn,
          contactNumber: userToUpdate.contactNumber,
          address: userToUpdate.address,
        },
      },
    });
  }
}
