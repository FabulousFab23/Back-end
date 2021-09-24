import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswersEntity } from "../entities/answers.entity";
import { Repository } from "typeorm";
import { LikesEntity, LikeTypeEnum } from "../entities/llikes.entity";
import { RecordsEntity } from "../entities/records.entity";
import { FileService } from "../files/file.service";
import { UsersEntity } from "../entities/users.entity";
import { FriendsEntity } from "../entities/friends.entity";
import { FriendsStatusEnum } from "../lib/enum";
import { CountryEntity } from "../entities/countries.entity";

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(AnswersEntity) private answersRepository: Repository<AnswersEntity>,
    @InjectRepository(LikesEntity) private likesRepository: Repository<LikesEntity>,
    @InjectRepository(RecordsEntity) private recordsRepository: Repository<RecordsEntity>,
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
    @InjectRepository(FriendsEntity) private friendsRepository: Repository<FriendsEntity>,
    @InjectRepository(CountryEntity) private countriesRepository: Repository<CountryEntity>,
    private readonly filesService: FileService
  ) {
  }

  async answerToRecord(user, record, buffer, filename) {
    const findRecord = await this.recordsRepository.findOne({ where: { id: record } });
    if (!findRecord) {
      throw new NotFoundException();
    }
    const uploadFile = await this.filesService.uploadPublic(buffer, filename);
    const entity = new AnswersEntity();
    entity.record = findRecord;
    entity.answerFile = uploadFile;
    entity.createdAt = new Date();
    entity.user = user;
    return this.answersRepository.save(entity);
  }

  async likeRecord(userId: string, recordId: string) {
    const record = await this.recordsRepository.findOne({ where: { id: recordId } });
    if (!record) {
      throw new NotFoundException();
    }

    const existingLike = await this.likesRepository.findOne({
        where: {
          user: userId,
          record: recordId
        }
      }
    );
    if (existingLike) {
      throw new BadRequestException("like exist");
    }
    const like = new LikesEntity();
    like.user = await this.usersRepository.findOne({ where: { id: userId } });
    like.record = record;
    like.type = LikeTypeEnum.RECORD;
    await this.recordsRepository.update(record.id, {likesCount: record.likesCount + 1 })
    // await this.recordsRepository
    //   .createQueryBuilder("record")
    //   .update(RecordsEntity)
    //   .set({ likesCount: () => 'likesCount + 1' })
    //   .where({id: record.id})
    //   .execute();
    await this.likesRepository
      .createQueryBuilder()
      .insert()
      .into(LikesEntity)
      .values(like)
      .execute();
    return like;
  }

  async likeAnswer(userId: string, answerId: string) {
    const answer = await this.answersRepository.findOne({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException();
    }

    const existingLike = await this.likesRepository.findOne({
        where: {
          user: userId,
          answer: answerId
        }
      }
    );
    if (existingLike) {
      throw new BadRequestException("like exist");
    }
    const like = new LikesEntity();
    like.user = await this.usersRepository.findOne({ where: { id: userId } });
    like.answer = answer;
    like.type = LikeTypeEnum.ANSWER;
    // await this.answersRepository
    //   .createQueryBuilder()
    //   .update(AnswersEntity)
    //   .set({ likesCount: () => "likesCount + 1" })
    //   .execute();
    await this.likesRepository
      .createQueryBuilder()
      .insert()
      .into(LikesEntity)
      .values(like)
      .execute();
    return like;
  }

  async addFriend(userId, friendId) {
    const findFriend = await this.usersRepository.findOne({ where: { id: friendId } });
    if (!findFriend) {
      throw new NotFoundException();
    }
    const existFriend = await this.friendsRepository.findOne({ where: { user: userId, friend: friendId } });
    if (existFriend) {
      throw new BadRequestException("user already friend");
    }
    const entity = new FriendsEntity();
    entity.user = userId;
    entity.friend = findFriend;
    entity.status = FriendsStatusEnum.ACCEPTED; //todo add notification service
    return this.friendsRepository.save(entity);
  }

  async removeFriend(userId, friendId) {
    const findFriend = await this.usersRepository.findOne({ where: { id: friendId } });
    if (!findFriend) {
      throw new NotFoundException();
    }
    const existFriend = await this.friendsRepository.findOne({ where: { user: userId, friend: friendId } });
    if (!existFriend) {
      throw new BadRequestException("user not you friend");
    }
    return this.friendsRepository.delete(existFriend.id);
  }

  async getAllCountries() {
    return this.countriesRepository.find()
  }

}
