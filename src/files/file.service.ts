import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PublicFileEntity } from "../entities/public-file.entity";
import { Repository } from "typeorm";
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from "nestjs-config";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PublicFileEntity) private publicFilesRepository: Repository<PublicFileEntity>,
    private readonly configService: ConfigService
    ) {
  }

  async uploadPublic(dataBuffer: Buffer, filename: string)  {
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('app.aws_public_bucket_name'),
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`
    })
      .promise();
    const generateId = uuid();
    const createFileEntity = new PublicFileEntity()
    createFileEntity.id = generateId;
    createFileEntity.key = uploadResult.Key;
    createFileEntity.url = uploadResult.Location;
    createFileEntity.link = `/files/${generateId}`;
    return this.publicFilesRepository.save(createFileEntity);
  }

  public async getPrivateFile(fileId: string) {
    const s3 = new S3();

    const fileInfo = await this.publicFilesRepository.findOne({ id: fileId });
    if (fileInfo) {
      const stream = await s3.getObject({
        Bucket: this.configService.get('app.aws_public_bucket_name'),
        Key: fileInfo.key
      })
        .createReadStream();
      return {
        stream,
        info: fileInfo,
      }
    }
    throw new NotFoundException();
  }
}
