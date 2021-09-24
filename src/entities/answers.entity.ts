import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { PublicFileEntity } from "./public-file.entity";
import { UsersEntity } from "./users.entity";
import { RecordsEntity } from "./records.entity";
import { LikesEntity } from "./llikes.entity";

@Entity({ name: "answers" })
export class AnswersEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, default: 0 })
  likesCount: number;

  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "createdAt"
  })
  createdAt: Date;

  @JoinColumn()
  @OneToOne(type => PublicFileEntity, answerFile => answerFile.answer) //todo remove from bucket
  answerFile: PublicFileEntity;

  @ManyToOne(type => UsersEntity, user => user.answers, { onDelete: "CASCADE", cascade: true })
  user: UsersEntity;

  @ManyToOne(type => RecordsEntity, record => record.answers) //todo remove with record?
  record: RecordsEntity;

  @OneToMany(type => LikesEntity, likes => likes.answer) //todo remove with record?
  likes: LikesEntity[];
}
