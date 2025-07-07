import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, SignInDto } from 'src/user/dto/user.dto';
import { RefeshTokenGuard } from './auth.refreshtoken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
  @Post('register')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(
      registerDto.email,
      registerDto.password,
      registerDto.comfirmpass,
    );
  }

  @UseGuards(RefeshTokenGuard)
  @Post('refresh')
  async getNewAccessToken(@Request() req) {
    return this.authService.getNewAccessToken(req.payload);
  }
}
