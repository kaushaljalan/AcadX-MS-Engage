import { Injectable } from '@nestjs/common';
import {createTransporter} from './common/mailer';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const transporter = await createTransporter();
    transporter.sendMail({
      subject: "Test",
      text: "I am sending an email from nodemailer!",
      to: "devu.nm21@gmail.com",
      from: process.env.EMAIL_ID
    })
    console.log('shut up')
    return 'Hello World!';
  }
}
