import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { Address, User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entity/user.entity';
import { Response } from 'src/shared/response';
import { UserResponseDto } from './dto/user-response.dto';
import { Cart } from 'src/schemas/cart.schema';
import { ROLES, STATUS, USER_STATUS } from 'src/shared/Enums';
import { UserRegisterDto } from './dto/user-register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AddressDto } from './dto/address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    const users = await this.userModel.find().select('-password').lean().exec();
    return new Response({
      success: true,
      message: 'Users list',
      data: users.map((user) => {
        return new UserResponseDto(user);
      }),
    });
  }

  async findUser(user) {
    return await this.userModel
      .findOne({ username: user.username, status: USER_STATUS.ACTIVE })
      .select('-_id -__v')
      .exec();
  }

  async create(userData: UserDto, user): Promise<any> {
    const username = userData.username.toLowerCase();
    if (
      userData.role &&
      userData.role != ROLES.ADMIN &&
      userData.role != ROLES.CUSTOMER
    ) {
      return new Response({
        success: false,
        message: 'Invald Role',
        data: null,
      });
    }
    const usersCount = await this.userModel.countDocuments();
    if (await this.userModel.findOne({ username: username })) {
      return new Response({
        success: false,
        message: 'User already exists',
      });
    }
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const newUser = await this.userModel.create({
      username: username,
      password: hashedPassword,
      systemId: usersCount + 1,
      role: userData?.role,
      createdBy: user.systemId,
    });

    const userEntity = new UserEntity(newUser);

    return new Response({
      success: true,
      message: 'User created',
      data: userEntity.returnUser(),
    });
  }

  async register(user: UserRegisterDto) {
    const username = user.username.toLowerCase();
    const password = user.password;
    if (password.length <= 6) {
      return new Response({
        success: false,
        message: 'Password must be atleast 6 characters long',
        data: null,
      });
    }
    if (await this.userModel.findOne({ username })) {
      return new Response({
        success: false,
        message: 'User already exists',
        data: null,
      });
    }
    const usersCount = await this.userModel.countDocuments();

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await this.userModel.create({
      username,
      password: hashedPassword,
      systemId: usersCount + 1,
    });
    const cartCount = await this.cartModel.countDocuments();
    await this.cartModel.create({
      systemId: cartCount + 1,
      userId: newUser.systemId,
      cartItems: [],
      updatedOn: new Date(),
    });
    const payload = {
      username: newUser.username,
      systemId: newUser.systemId,
      role: newUser.role,
      timestamp: newUser.createdOn,
    };

    const token = this.jwtService.sign(payload);
    return new Response({
      success: true,
      message: 'User registerd',
      data: {
        user: {
          systemId: newUser.systemId,
          username: newUser.username,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          createdOn: newUser.createdOn,
          contactNumber: newUser.contactNumber,
          address: newUser.address,
        },
        authenticationToken: token,
      },
    });
  }

  async fetchUserById(userId: number) {
    const user = await this.userModel.findOne({ systemId: userId });
    return new Response({
      success: true,
      message: 'User found',
      data: {
        username: user.username,
        fullname: `${user.firstName} ${user.lastName}`,
        phoneNumber: user.contactNumber,
        role: user.role,
        createdOn: user.createdOn,
      },
    });
  }

  async update(userData, user: any) {
    const userToUpdate = await this.userModel.findOne({
      systemId: user.systemId,
    });
    if (!userToUpdate) {
      return new Response({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    userToUpdate.set(userData);
    await userToUpdate.save();
    const userEntity = new UserEntity(userToUpdate);
    return new Response({
      success: true,
      message: 'User updated',
      data: userEntity.returnUser(),
    });
  }

  async addAddress(address: AddressDto, user) {
    const userToUpdate = await this.userModel.findOne({
      systemId: user.systemId,
    });
    if (!userToUpdate) {
      return new Response({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    let newAddress = new Address({
      systemId: userToUpdate.address.length + 1,
      name: address.name,
      contactNumber: address.contactNumber,
      firstAddress: address.firstAddress,
      secondAddress: address.secondAddress,
      pincode: address.pincode,
      country: address.country,
      state: address.state,
      status: STATUS.ACTIVE,
    });
    userToUpdate.address.push(newAddress);
    await userToUpdate.save();
    return new Response({
      success: true,
      message: 'Address added',
      data: newAddress,
    });
  }

  async deleteAddress(addressId: number, user) {
    const userToUpdate = await this.userModel.findOne({
      systemId: user.systemId,
    });
    if (!userToUpdate) {
      return new Response({
        success: false,
        message: 'User not found',
        data: null,
      });
    }

    const addressToDelete = userToUpdate.address.find(
      (address) => address.systemId === +addressId,
    );

    if (!addressToDelete) {
      return new Response({
        success: false,
        message: 'Address not found',
        data: null,
      });
    }
    addressToDelete.status = STATUS.DELETED;
    await userToUpdate.save();
    return new Response({
      success: true,
      message: 'Address deleted',
      data: this.getAddressResponse(userToUpdate.address),
    });
  }

  getAddressResponse(address) {
    let addressDetails = address
      .filter((address) => address.status === STATUS.ACTIVE)
      .map((address) => {
        return {
          systemId: address.systemId,
          name: address.name,
          contactNumber: address.contactNumber,
          firstAddress: address.firstAddress,
          secondAddress: address.secondAddress,
          pincode: address.pincode,
          country: address.country,
          state: address.state,
        };
      });

    return addressDetails;
  }

  async getProfile(user: any) {
    const userDetail = await this.userModel.findOne({
      systemId: user.systemId,
    });

    return new Response({
      success: true,
      message: 'User profile',
      data: {
        systemId: userDetail.systemId,
        username: userDetail.username,
        role: userDetail.role,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        createdOn: userDetail.createdOn,
        contactNumber: userDetail.contactNumber,
        address: this.getAddressResponse(userDetail.address),
      },
    });
  }
  async getTotalUsers() {
    const users = await this.userModel.countDocuments({ role: ROLES.CUSTOMER });
    return users;
  }

  async getTrends(start, end) {
    const users = await this.userModel
      .find({ createdOn: { $gte: start, $lte: end } })
      .select('-password -_id -__v').lean()
      .exec();
    const trends = users.map((user) => {
      return new UserResponseDto(user);
    });
    return trends;
  }

  async dropCollection() {
    await this.userModel.deleteMany({});
    await this.seedAdmin();
  }

  async seedAdmin() {
    const admin = new this.userModel({
      username: ROLES.ADMIN,
      password: bcrypt.hashSync(ROLES.ADMIN, 10),
      systemId: 1,
      role: ROLES.ADMIN,
    });
    await admin.save();
  }
}
