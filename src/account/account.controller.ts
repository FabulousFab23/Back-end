import { Body, Controller, Get, Put, Req, Res } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CompleteRegisterDto } from "./dto/complete-register.dto";

@Controller('account')
@ApiBearerAuth()
@ApiTags("account")
export class AccountController {
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
      .catch((e) => res.sendStatus(400))
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
      .catch((e) => res.sendStatus(400))
  }

}
