import { Injectable, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import * as fs from 'node:fs';

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

  constructor(private configService: ConfigService) {}

  async sendOTP(
    fullName: string,
    email: string,
    type: 'emailVerification' = 'emailVerification',
  ) {
    const html = this.getHtml(type, { fullName });

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
      name: 'OTP ',
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

      return true;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to send email');
    }

    return;
  }

  getHtml(templateName: string, data: Record<string, string>): string {
    const file = fs.readFileSync(
      __dirname + `/templates/${templateName}.html`,
      'utf8',
    );
    const template = Handlebars.compile(file);
    return template(data);
  }
}
