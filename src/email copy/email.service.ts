import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { Model } from 'mongoose';
import * as fs from 'node:fs';
import { Email } from './entities/email.entity';
import { InjectModel } from '@nestjs/mongoose';
import { generateCode } from 'src/utility/heper';

type MailSendOptions = {
  subject: string;
  message: string;
  to: {
    email: string;
    name: string;
  };
};

@Injectable()
export class EmailService {
  private emailProviderAPIUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(
    @InjectModel(Email.name)
    private emailModel: Model<Email>,
    private configService: ConfigService,
  ) {}

  async sendOTP(
    fullName: string,
    email: string,
    type: 'emailVerification' = 'emailVerification',
  ) {
    const now = new Date();
    const expireAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const createdEmail = await this.emailModel.create({
      toName: fullName,
      toEmail: email,
      name: type,
      token: generateCode(),
      expireAt,
    });

    const url = `${this.configService.get(
      'APP_URL',
      'http://localhost:3000',
    )}/auth/verify-email/${createdEmail.token}`;

    const html = this.getHtml(type, { fullName, url });

    this.send({
      subject: 'Bookclouder - OTP Verification',
      message: html,
      to: {
        email,
        name: fullName,
      },
    });
    return;
  }

  async send(options: MailSendOptions): Promise<boolean> {
    const { subject, message: htmlContent, to } = options;
    const APIUrl = this.configService.get(
      'BRAVO_EMAIL_API_URL',
      this.emailProviderAPIUrl,
    );
    const API_KEY = this.configService.get('BRAVO_EMAIL_API_KEY');
    if (!API_KEY) {
      return false;
    }
    const body = JSON.stringify({
      name: 'Email Verification',
      subject,
      sender: { name: 'Bookclouder', email: 'notifications@finepher.com' },
      type: 'classic',
      htmlContent,
      to: [to],
    });

    try {
      const req = await fetch(APIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${API_KEY}`,
        },
        body,
      });

      const json = await req.json();

      if (!req.ok) {
        console.error(`Brevo API Error: ${json.message}`);
        throw new Error('Failed to send email');
      }
      const now = new Date();
      fs.appendFileSync(
        './mail.log',
        [body, JSON.stringify(json), now.toString(), '\n'].join('\n'),
      );

      return true;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to send email');
    }
  }

  getHtml(templateName: string, data: Record<string, string>): string {
    const file = fs.readFileSync(
      __dirname + `/templates/${templateName}.html`,
      'utf8',
    );
    const template = Handlebars.compile(file);
    return template(data);
  }

  async verifyEmail(uuid: string): Promise<boolean> {
    const email = await this.emailModel.findOneAndUpdate(
      {
        token: uuid,
      },
      { isUsed: true },
    );
    if (email == null) {
      throw new NotFoundException();
    }
    const expired = new Date(email.expireAt);
    const now = new Date();
    if (expired.getTime() <= now.getTime() && email.isUsed != true) {
      throw new UnauthorizedException('Link has expired');
    }
    return true;
  }
}
