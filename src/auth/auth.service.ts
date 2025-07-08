import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(
    email: string,
    password: string,
    comfirmpass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    if (password !== comfirmpass) {
      throw new BadRequestException('password do not match comfirm password');
    }
    if (await this.usersService.isDuplicate(email)) {
      console.log(await this.usersService.isDuplicate(email));
      throw new BadRequestException('Duplicate email');
    }
    const user = new User();
    user.email = email;
    user.password = password;
    this.usersService.addOneUser(user);
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_SECRET', 'default'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET', 'default'),
    });
    return { access_token, refresh_token };
  }
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new BadRequestException('wrong password');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_SECRET', 'default'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET', 'default'),
    });
    return { access_token, refresh_token };
  }
  async getNewAccessToken(payload: {
    sub: number;
    email: string;
  }): Promise<{ access_token: string }> {
    const access_token = await this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET', 'default'),
      },
    );
    return { access_token };
  }
}
