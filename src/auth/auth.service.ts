import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValidPassword = this.userService.isValidPassword(pass, user.password);
      if (isValidPassword) {
        return user;
      }
      return null;
    }
    return null;
  }
}
