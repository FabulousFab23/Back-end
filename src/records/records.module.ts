import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordsEntity } from "../entities/records.entity";
import { FileService } from "../files/file.service";
import { UsersService } from "../users/users.service";
import { PublicFileEntity } from "../entities/public-file.entity";
import { UsersEntity } from "../entities/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RecordsEntity,
        PublicFileEntity,
        UsersEntity
      ])
  ],
  providers: [RecordsService, FileService, UsersService],
  controllers: [RecordsController]
})
export class RecordsModule {}
