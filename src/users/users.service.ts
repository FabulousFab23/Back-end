import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import { GeneratorUtil } from "../lib/generator-util";
import { FileService } from "../files/file.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
    private readonly filesService: FileService
  ) {
  }

  /*for auth*/
  findOneByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        "id",
        "email",
        "pseudo",
        "password",
        "lastActivity"
      ]
    });
  }

  findOneByIdForPayload(id: string): Promise<UsersEntity> { // for refresh
    return this.usersRepository.findOne({ where: { id }, select: ["id", "pseudo", "email"] });
  }

  updateActivity(id: string) {
    const dateNow = new Date();
    return this.usersRepository
      .createQueryBuilder()
      .update(UsersEntity)
      .set({ lastActivity: dateNow })
      .where("users.id = :id", { id })
      .execute();
  }

  findByIdRecover(id: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({ where: { id }, select: ["id", "email"] });
  }

  async updatePassword(request, id) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    const password = await GeneratorUtil.generateHash(request.password);
    return this.usersRepository
      .createQueryBuilder("users")
      .update(UsersEntity)
      .set({ password: password })
      .where({ id: user.id })
      .execute();
  }


  async getById(id: string) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND);
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublic(imageBuffer, filename);
    const user = await this.getById(userId);
    await this.usersRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id }, relations: ["avatar"] });
  }

  createUser(newUser: UsersEntity): Promise<UsersEntity> {
    return this.usersRepository.save(newUser);
  }

  completeRegister(findUser: UsersEntity) {
    return this.usersRepository.save(findUser);
  }

  findUserByPseudo(pseudo) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.pseudo ilike :pseudo', { pseudo })
      .select([
        'user.id',
        'user.pseudo',
        'user.gender',
      ])
      .getMany()
  }

}
