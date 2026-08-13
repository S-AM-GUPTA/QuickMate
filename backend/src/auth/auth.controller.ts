import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('check')
  checkUserExists(@Body() checkDto: Record<string, any>) {
    return this.authService.checkUserExists(checkDto.identifier);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('request-otp')
  requestOtp(@Body('identifier') identifier: string) {
    return this.authService.requestOtp(identifier);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  verifyOtp(@Body() verifyDto: Record<string, any>) {
    return this.authService.verifyOtpAndRegister(
      verifyDto.identifier,
      verifyDto.otpCode,
      verifyDto.newPassword,
      verifyDto.name,
      verifyDto.phone,
      verifyDto.postalCode,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body('identifier') identifier: string) {
    return this.authService.forgotPassword(identifier);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() resetDto: Record<string, any>) {
    return this.authService.resetPassword(
      resetDto.identifier,
      resetDto.otpCode,
      resetDto.newPassword,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.identifier,
      dto.password,
      dto.name,
      dto.phone
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('oauth')
  oauth(@Body('idToken') idToken: string) {
    return this.authService.loginWithOAuth(idToken);
  }
}
