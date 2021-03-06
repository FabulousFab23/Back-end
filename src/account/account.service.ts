import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CompleteRegisterDto } from "./dto/complete-register.dto";
import { RecordsService } from "../records/records.service";
import { FileService } from "../files/file.service";
import { FileTypeEnum } from "../lib/enum";

@Injectable()
export class AccountService {
  constructor(
    private usersService: UsersService,
    private recordsService: RecordsService,
    private fileService: FileService
  ) {
  }

  async getAccountData(user) {
    const userDataQuery = this.usersService.findById(user.id);
    const limitsQuery = this.recordsService.getTodayCount(user);
    const [userData, limitData] = await Promise.all([userDataQuery, limitsQuery]);
    return { ...userData, ...limitData };
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

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    const findUser = await this.usersService.getById(userId);
    const avatar = await this.fileService.uploadFile(imageBuffer, filename, FileTypeEnum.IMAGE);
    await this.usersService.updateAvatar(userId, {
      ...findUser,
      avatar
    });
    return avatar;
  }
}
