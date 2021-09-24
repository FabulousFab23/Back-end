import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordsEntity } from "../entities/records.entity";
import { Repository } from "typeorm";
import { FileService } from "../files/file.service";
import { UsersService } from "../users/users.service";
import { RecordDto } from "./dto/record.dto";

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordsEntity) private recordsRepository: Repository<RecordsEntity>,
    private readonly filesService: FileService,
    private readonly usersService: UsersService
  ) {
  }

  async getRecordsByUser(page, limit, order, user = null) {
    const getLimit = Number(limit) <= 0 || Number(limit) > 50 ? 50 : Number(limit);
    const getPage = Number(page);
    const offset = getPage === 1 || getPage <= 0 ? 0 : (getPage - 1) * getLimit;
    const queryBuilder = await this.recordsRepository.createQueryBuilder("records")
      .leftJoin("records.answers", "answers")
      .leftJoin("answers.answerFile", "answerFile")
      .leftJoin("answers.user", "user")
      .loadRelationCountAndMap('records.answersCount', 'records.answers', 'answers')
      .leftJoin("records.file", "file")
      .select([
        "records.id",
        "records.title",
        "records.emoji",
        "records.colorType",
        "records.likesCount",
        "records.createdAt",
        "answers.id", // todo remove and add endpoint to get answers by record id
        "answers.createdAt",
        "answerFile.id",
        "answerFile.link",
        "user.id",
        "user.pseudo",
        "user.avatar",
        "file.id",
        "file.link"
      ]);
    if (user) {
      await queryBuilder.where({ user: user.id });
    }
    return  queryBuilder
      .orderBy("records.createdAt", order.toUpperCase())
      .offset(offset)
      .limit(getLimit)
      .getMany();
  }

  async addRecord(body: RecordDto, user, buffer, filename) {
    const findUser = await this.usersService.getById(user.id);
    const uploadFile = await this.filesService.uploadPublic(buffer, filename);
    const rand = Math.floor(Math.random() * (30));
    const entity = new RecordsEntity();
    entity.title = body.title;
    entity.emoji = body.emoji;
    entity.file = uploadFile;
    entity.user = findUser;
    entity.colorType = rand;
    return this.recordsRepository.save(entity);
  }

}
