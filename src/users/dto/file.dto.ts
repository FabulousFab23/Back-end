import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class FileDto {
  @ApiModelProperty({ type: 'string', format: 'binary', required: false })
  readonly file?: any;
}