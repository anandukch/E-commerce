import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { GetUserResponseDto } from './dto/user-id-response.dto';
import { ROLES } from 'src/shared/Enums';
import { Request } from 'express';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './entity/user.entity';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressDto } from './dto/address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'List of All Users',
    type: [UserResponseDto],
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'User Created',
    type: UserEntity,
  })
  async create(@Body() user: UserDto, @Req() req: Request) {
    return await this.usersService.create(user, req.user);
  }

  @Post('/register')
  @ApiResponse({
    status: 200,
    description: 'User Registerd',
    type: LoginResponseDto,
  })
  async register(@Body() user: UserRegisterDto) {
    return await this.usersService.register(user);
  }

  @Roles(ROLES.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/profile')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: UserProfileDto,
  })
  async getUserProfile(@Req() req: Request) {
    return await this.usersService.getProfile(req.user);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:userId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: GetUserResponseDto,
  })
  async getUserById(@Param('userId') userId: number) {
    return await this.usersService.fetchUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'update User data',
    type: GetUserResponseDto,
  })
  async update(@Body() userData: UpdateUserDto, @Req() req: Request) {
    return await this.usersService.update(userData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/address')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'address added',
    type: AddressResponseDto,
  })
  async addAddress(@Body() address: AddressDto, @Req() req: Request) {
    return await this.usersService.addAddress(address, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/address/:addressId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiOperation({
    description: 'used to delete an address of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'address deleted',
    type: [AddressResponseDto],
  })
  async deleteAddress(
    @Param('addressId') addressId: number,
    @Req() req: Request,
  ) {
    return await this.usersService.deleteAddress(addressId, req.user);
  }
}
