import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../entities/users.entity";
import { RefreshTokenEntity } from "../entities/token.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersService } from "../users/users.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { MailService } from "../mail/mail.service";
import { TokenService } from "./token/token.service";
import { JwtMiddleware } from "./middleware/jwt.middleware";
import { LocalMiddleware } from "./middleware/local.middleware";
import { PasswordResetEntity } from "../entities/reset-password.entity";
import { FileService } from "../files/file.service";
import { PublicFileEntity } from "../entities/public-file.entity";
import { AccountController } from "../account/account.controller";
import { UsersController } from "../users/users.controller";
import { ActionsController } from "../actions/actions.controller";
import { FilesController } from "../files/files.controller";
import { RecordsController } from "../records/records.controller";

@Module({
  imports: [
    PassportModule.register({defaultStrategy: "jwt"}),
    TypeOrmModule.forFeature(
      [
        UsersEntity,
        RefreshTokenEntity,
        PasswordResetEntity,
        PublicFileEntity
      ])
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    FileService,
    MailService,
    TokenService
  ],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        {
          path: 'refresh',
          method: RequestMethod.PUT,
        },
        {
          path: 'login',
          method: RequestMethod.POST,
        },
        {
          path: 'register',
          method: RequestMethod.POST,
        },
        {
          path: 'forgot-password',
          method: RequestMethod.GET,
        },
        {
          path: 'forgot-password',
          method: RequestMethod.POST,
        },
        {
          path: 'recover?token=(.*)',
          method: RequestMethod.GET,
        },
        {
          path: 'recover?token=(.*)',
          method: RequestMethod.POST,
        },
        {
          path: 'files/(.*)',
          method: RequestMethod.GET,
        },
        {
          path: 'img/(.*)',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(
        AuthController,
        AccountController,
        UsersController,
        ActionsController,
        FilesController,
        RecordsController
      );
    consumer
      .apply(LocalMiddleware)
      .exclude(
        {
          path: 'refresh',
          method: RequestMethod.PUT,
        },
        {
          path: 'register',
          method: RequestMethod.POST,
        },
        {
          path: 'forgot-password',
          method: RequestMethod.GET,
        },
        {
          path: 'forgot-password',
          method: RequestMethod.POST,
        },
        {
          path: 'recover?token=(.*)',
          method: RequestMethod.GET,
        },
        {
          path: 'recover?token=(.*)',
          method: RequestMethod.POST,
        },
        {
          path: 'logout-everywhere',
          method: RequestMethod.POST,
        },
        {
          path: 'logout',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(AuthController);
  }
}
