import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async checkUserExists(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
    return { exists: !!user, hasPassword: !!user?.password };
  }

  async requestOtp(identifier: string) {
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const isEmail = identifier.includes('@');
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpiresAt },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: isEmail ? identifier : `${identifier}@placeholder.com`,
          phone: !isEmail ? identifier : null,
          name: 'New User',
          otpCode,
          otpExpiresAt,
        },
      });
    }

    // Simulate OTP in Console
    console.log(`\n[FALLBACK SIMULATED OTP] ${otpCode} for ${identifier}\n`);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtpAndRegister(
    identifier: string,
    otpCode: string,
    newPassword?: string,
    name?: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (
      user.otpCode !== otpCode ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const updateData: any = {
      otpCode: null,
      otpExpiresAt: null,
      isVerified: true,
    };
    if (name) updateData.name = name;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async register(
    identifier: string,
    password?: string,
    name?: string,
    phone?: string
  ) {
    const isEmail = identifier.includes('@');
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

    user = await this.prisma.user.create({
      data: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: isEmail ? identifier : `${identifier}@placeholder.com`,
        phone: phone || (!isEmail ? identifier : null),
        name: name || 'New User',
        password: hashedPassword,
        isVerified: true,
      },
    });

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    };
  }

  async login(identifier: string, pass?: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass || '', user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
