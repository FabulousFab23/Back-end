import { ApiProperty } from "@nestjs/swagger";


export class RecordAnswersResponse {

  @ApiProperty({ example: "9daaf749-6202-4b6f-86fc-133ce7ed8c23" })
  id: string;

  @ApiProperty({
    example: {
      id: "8fe9bb49-a4c1-4f5f-86eb-2b1e3a71aa77",
      link: "/files/8fe9bb49-a4c1-4f5f-86eb-2b1e3a71aa77"
    }
  })
  answerFile: {
    id: string,
    link: string,
  };
  @ApiProperty({
    example: {
      "id": "37aabe08-b7de-48f1-85b3-85f886e9ba1f",
      "pseudo": "Jonh",
      "avatar": "link"
    }
  })
  user: {
    id: string,
    pseudo: string,
    avatar: string,
  };
}

export class RecordsResponse {

  @ApiProperty({ example: "9daaf749-6202-4b6f-86fc-133ce7ed8c23" })
  id: string;

  @ApiProperty({ example: "title" })
  title: string;

  @ApiProperty({ example: "😎" })
  emoji: string;

  @ApiProperty({ example: 2 })
  colorType: number;

  @ApiProperty({ example: 2 })
  likesCount: number;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({type: [RecordAnswersResponse]})
  answers: RecordAnswersResponse[];

  user: {
    id: string,
    pseudo: string,
    avatar: string,
  };

  file: {
    id: string;
    link: string;
  }
}