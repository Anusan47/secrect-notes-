import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import sendMail from '../common/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ email, password: hashed });
    await created.save();
    // optionally send welcome mail
    return { id: created._id, email: created.email };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token, user: { id: user._id, email: user.email } };
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
