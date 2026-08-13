import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

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
    console.log(`\n[OTP GENERATED] ${otpCode} for ${identifier}\n`);

    if (isEmail) {
      try {
        await this.transporter.sendMail({
          from: `"QuickMate" <${process.env.SMTP_USER}>`,
          to: identifier,
          subject: 'Your QuickMate Verification Code',
          html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #f9f9f9;">
              <img src="https://quickmate.vercel.app/logo.png" alt="QuickMate Logo" style="height: 60px; margin-bottom: 20px;" />
              <h2 style="color: #333; margin-bottom: 20px;">Verify your email</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Use the following OTP to complete your sign up. It expires in 10 minutes.
              </p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #509209; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd; display: inline-block;">
                ${otpCode}
              </div>
            </div>
          `,
        });
        console.log(`Email sent successfully to ${identifier}`);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtpAndRegister(
    identifier: string,
    otpCode: string,
    newPassword?: string,
    name?: string,
    phone?: string,
    postalCode?: string,
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
    if (phone) updateData.phone = phone;
    if (postalCode) updateData.postalCode = postalCode;
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async forgotPassword(identifier: string) {
    const isEmail = identifier.includes('@');
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      throw new BadRequestException('User not found. Please check your email or phone number.');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiresAt },
    });

    console.log(`\n[PASSWORD RESET OTP] ${otpCode} for ${identifier}\n`);

    if (isEmail) {
      try {
        await this.transporter.sendMail({
          from: `"QuickMate" <${process.env.SMTP_USER}>`,
          to: identifier,
          subject: 'Reset your QuickMate Password',
          html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #f9f9f9;">
              <img src="https://quickmate.vercel.app/logo.png" alt="QuickMate Logo" style="height: 60px; margin-bottom: 20px;" />
              <h2 style="color: #333; margin-bottom: 20px;">Reset your password</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Use the following code to reset your password. It expires in 10 minutes.
              </p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #e11d48; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd; display: inline-block;">
                ${otpCode}
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    return { message: 'Password reset code sent' };
  }

  async resetPassword(identifier: string, otpCode: string, newPassword?: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

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
      throw new BadRequestException('Invalid or expired code');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async loginWithOAuth(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(idToken);
      const email = decodedToken.email;
      const name = decodedToken.name || 'OAuth User';
      
      if (!email) {
        throw new BadRequestException('OAuth token did not contain an email');
      }

      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email,
            name,
            isVerified: true,
          },
        });
      }

      const payload = { sub: user.id, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid OAuth token');
    }
  }
}

