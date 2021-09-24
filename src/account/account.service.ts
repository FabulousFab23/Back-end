import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CompleteRegisterDto } from "./dto/complete-register.dto";

@Injectable()
export class AccountService {
  constructor(private usersService: UsersService) {
  }

  getAccountData(user) {
    return this.usersService.findById(user.id);
  }

  async updateProfile(user, body: CompleteRegisterDto) {
    const findUser = await this.usersService.findById(user.id);
    findUser.pseudo = body.pseudo;
    findUser.dob = body.dob;
    findUser.updatedAt = new Date();
    findUser.country = body.country;
    findUser.gender = body.gender;
    findUser.isProfileCompleted = true;
    return this.usersService.completeRegister(findUser);
  }
}
