import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RecordsEntity } from "./records.entity";
import { AnswersEntity } from "./answers.entity";

@Entity({ name: "s3_files" })
export class PublicFileEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column({ default: null })
  link: string;

  @Column()
  public key: string;

  @OneToOne(type => RecordsEntity, record => record.file)
  record: RecordsEntity;

  @OneToOne(type => AnswersEntity, answer => answer.answerFile)
  answer: AnswersEntity;

}