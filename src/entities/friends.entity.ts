import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FriendsStatusEnum } from "../lib/enum";

@Entity({name: 'friends'})
export class FriendsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.from, { onDelete: "CASCADE" })
  user: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.to, { onDelete: "CASCADE" })
  friend: UsersEntity;

  @Column({
    nullable: true,
    type: "enum",
    enum: FriendsStatusEnum
  })
  status: FriendsStatusEnum;

  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "createdAt"
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    name: "updatedAt"
  })
  updatedAt: Date;
}