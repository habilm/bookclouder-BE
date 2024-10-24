import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendOTP(
    email: string,
    type: 'emailVerification' = 'emailVerification',
  ) {
    // Send OTP to the provided email
    return;
  }

  async send(subject: string, message: string, to: string): Promise<boolean> {
    return;
  }
}
