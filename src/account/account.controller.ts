import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { AccountService } from "./account.service";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompleteRegisterDto } from "./dto/complete-register.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AvatarDto } from "./dto/avatar.dto";

@Controller('account')
@ApiBearerAuth()
@ApiTags("account")
export class AccountController {
  private readonly logger = new Logger(AccountController.name);
  constructor(private accountService: AccountService) {
  }

  @Get('me')
  async getAccountInfo(
    @Req() req,
    @Res() res,
  ) {
    const user = req.user;
    return this.accountService.getAccountData(user)
      .then((data) => res.json(data))
      .catch(err => !err.status ? this.logger.error(err) : res.status(err.status).send(err.response));
  }

  @Put()
  async completeRegister(
    @Req() req,
    @Res() res,
    @Body() body: CompleteRegisterDto
  ) {
    const user = req.user;
    return this.accountService.updateProfile(user, body)
      .then((data) => res.json(data))
      .catch(err => !err.status ? this.logger.error(err) : res.status(err.status).send(err.response));
  }

  @Post("avatar")
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: HttpStatus.CREATED, description: "The file has been uploaded" })
  @ApiOperation({ description: "field name: \"file\" | max item size: 4mb | file extension: jpg|jpeg|png" })
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
    @Req() req,
    @Res() res,
    @UploadedFile() file,
    @Body() body: AvatarDto
  ) {
    const user = req.user;
    return this.accountService.addAvatar(user.id, file.buffer, file.originalname)
      .then((data) => res.json(data))
      .catch(err => !err.status ? this.logger.error(err) : res.status(err.status).send(err.response));
  }

}
