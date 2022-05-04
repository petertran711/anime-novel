import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('APP_ID'),
      clientSecret: configService.get<string>('APP_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL')}/auth/facebook/redirect`,
      scope: "email",
      profileFields: [
        "id",
        "first_name",
        "last_name",
        "middle_name",
        "name_format",
        "picture",
        "short_name",
        "emails"
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {

    const { name, emails, id } = profile;
    const user = {
      id,
      email: emails && emails[0] && emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    
    const payload = {
      ...user,
      accessToken,
    };

    done(null, payload);
  }
}
