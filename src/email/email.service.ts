import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectModel } from '@nestjs/mongoose';
import { ThrottlerException } from '@nestjs/throttler';
import { Model } from 'mongoose';
import * as fs from 'node:fs';
import { getHtml } from '../utility/hbs';
import * as helper from '../utility/helper';
import { errorLog } from '../utility/logs';
import { Email } from './entities/email.entity';

type MailSendOptions = {
  subject: string;
  message: string;
  to: {
    email: string;
    name: string;
  };
};

export enum EmailTypes {
  VERIFY_EMAIL = 'verify-email',
  FORGOT_PASSWORD = 'forgot-password',
}

@Injectable()
export class EmailService {
  private emailProviderAPIUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(
    @InjectModel(Email.name)
    private emailModel: Model<Email>,
    private configService: ConfigService,
  ) {}

  /**
   * Function to send email to the specified email address with a token.
   * @param fullName User Full name
   * @param email The email address to send
   * @param type type of email. e.g. verify-email, forgot-password. The type string is using to take the email body template.
   * so make sure the email template is exist with the type name (${type}.html) in template folder.
   * Also the type will be added in the url before the URL. the URL format is  `${BASE_URL}/auth/${type}/${token}`
   *
   * @returns
   */
  async sendOTP(
    fullName: string,
    email: string,
    type: EmailTypes = EmailTypes.VERIFY_EMAIL,
  ) {
    const now = new Date();
    const expireAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

    const alreadySent = await this.emailModel.countDocuments({
      toEmail: email,
      type,
      isUsed: false,
      expireAt: { $gte: now },
    });

    if (alreadySent >= 3) {
      throw new ThrottlerException(
        'Too many verification requests for this email',
      );
    }

    const createdEmail = await this.emailModel.create({
      toName: fullName,
      toEmail: email,
      type,
      token: helper.generateCode(),
      expireAt,
    });

    const url = `${this.configService.get(
      'APP_URL',
      'http://localhost:3000',
    )}/auth/${type}/${createdEmail.token}`;

    const html = getHtml(type + '.email', { fullName, url });

    await this.send({
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

      const now = new Date();
      try {
        fs.appendFileSync(
          './logs/mail.log',
          [body, JSON.stringify(json), now.toString(), '\n'].join('\n'),
        );
      } catch (err) {
        console.error(err);
      }

      if (!req.ok) {
        console.error(`Brevo API Error: ${json.message}`);
        throw new Error('Failed to send email');
      }

      return true;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to send email');
    }
  }

  /**
   *
   * @param uuid The Unique string of the email address verification.
   * @returns string The email address
   */
  async verifyEmail(uuid: string, type: EmailTypes): Promise<string> {
    const email = await this.emailModel.findOneAndUpdate(
      {
        token: uuid,
        type: type,
      },
      { isUsed: true },
    );
    if (email == null) {
      errorLog('Tring to verify email with invalid email address');
      throw new UnauthorizedException('Link has expired');
    }
    const expired = new Date(email.expireAt);
    const now = new Date();
    if (email.isUsed == true) {
      throw new UnauthorizedException(
        'You have used this one-time link already.',
      );
    }
    if (expired.getTime() <= now.getTime()) {
      throw new UnauthorizedException('Link has expired');
    }

    return email.toEmail;
  }
}
