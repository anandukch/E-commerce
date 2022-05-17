import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generateOtp.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Login Api',
    type: LoginResponseDto,
  })
  async login(@Body() user: LoginDto) {
    if (!user.hasOwnProperty('username')) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User Field missing',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.authService.login(user);
  }

  @ApiResponse({
    status: 200,
    description: 'otp genertation',
  })
  @Post('/generateOtp')
  async generateOtp(@Body() userData: GenerateOtpDto) {
    return await this.authService.generateOtp(userData);
  }

  @Post('/verifyOtp')
  @ApiResponse({
    status: 200,
    description: 'update User data',
  })
  async verifyOtp(@Body() userData: VerifyOtpDto) {
    return await this.authService.verifyOTP(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/resetPassword')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'update User data',
    type: UserProfileDto,
  })
  async resetPassword(@Body() userData: ResetPasswordDto, @Req() req: Request) {
    return await this.authService.resetPassword(userData, req.user);
  }
}
