import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { FileService } from "./file.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('files')
@ApiBearerAuth()
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FileService) {
  }

  @Get(':id')
  async getPrivateFile(
    @Req() request,
    @Param('id') id: string,
    @Res() res
  ) {
    const file = await this.filesService.getPrivateFile(id);
    console.log(file)
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
    });
    return file.stream.pipe(res)
  }
}
