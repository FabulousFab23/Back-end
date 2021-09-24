import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../entities/users.entity";
import { RefreshTokenEntity } from "../entities/token.entity";
import { FileService } from "../files/file.service";
import { PublicFileEntity } from "../entities/public-file.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        UsersEntity,
        RefreshTokenEntity,
        PublicFileEntity
      ])
  ],
  providers: [UsersService, FileService],
  controllers: [UsersController]
})
export class UsersModule {}
