import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class RecordDto {

  @ApiModelProperty({ type: 'string', })
  title: string;

  @ApiModelProperty({ type: 'string', example: '😎'})
  emoji: string;

  @ApiModelProperty({ type: 'number', example: 45})
  duration: number;

  @ApiModelProperty({ type: 'string', format: 'binary', required: true })
  file: any;
}