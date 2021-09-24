import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post, Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileDto } from "./dto/file.dto";

@Controller("users")
@ApiBearerAuth()
@ApiTags("users")
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Post("avatar")
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: HttpStatus.CREATED, description: "The file has been uploaded" })
  @ApiOperation({ description: "field name: \"file\" | max item size: 20mb | file extension: jpg|jpeg|png|gif" })
  @ApiOperation({ summary: "roles: webmaster" })
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
    @Req() request,
    @UploadedFile() file,
    @Body() body: FileDto
  ) {
    return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  @Get("search")
  @ApiQuery({ name: "pseudo", required: true })
  async findUser(
    @Req() req,
    @Res() res,
    @Query("pseudo") pseudo: string
  ) {
    return this.usersService.findUserByPseudo(pseudo)
      .then((data) => res.json(data))
      .catch((e) => res.sendStatus(400));
  }

}
