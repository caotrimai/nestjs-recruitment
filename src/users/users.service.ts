import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  isValidId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!this.isValidId(id)) {
      return 'not found user';
    }
    return this.userModel.findOne({ _id: id });
  }
  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  update(updateUserDto: UpdateUserDto) {
    if (!this.isValidId(updateUserDto._id)) {
      return 'not found user';
    }
    return this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  remove(id: string) {
    if (!this.isValidId(id)) {
      return 'not found user';
    }
    return this.userModel.deleteOne({ _id: id });
  }
}
