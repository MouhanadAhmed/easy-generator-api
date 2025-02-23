import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaService {
  constructor(private configService: ConfigService) {}

  async verifyRecaptcha(recaptchaToken: string): Promise<boolean> {
    const RECAPTCHA_SECRET_KEY = this.configService.get('RECAPTCHA_SECRET_KEY');
    const recaptchaUrl = this.configService.get('RECAPTCHA_URL');
    const verificationUrl = `${recaptchaUrl}?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    try {
      const response = await axios.post(verificationUrl);
      return response.data.success;
    } catch (error) {
      throw new HttpException(
        'ReCAPTCHA verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
