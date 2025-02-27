import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { TValidationErrors } from 'src/app.interface';

@Injectable()
export class JoiValidationPipe<T = any> implements PipeTransform {
  constructor(private schema: Joi.Schema<T>) {}

  transform(value: T): T {
    const result = this.schema.validate(value, { abortEarly: false });
    const error = result.error;
    const validationValue = result.value as T;

    if (error) {
      const details = error.details;
      throw new BadRequestException({
        message: details.map(detail => detail.message).join(', '),
        error: 'Bad Request',
        errors: {
          errorsKey: details.map(detail => detail.path[0]),
          value: this.getObjectErrors(details),
        },
        statusCode: 400,
      });
    }

    return validationValue;
  }

  private getObjectErrors(details: Joi.ValidationErrorItem[]): TValidationErrors {
    const result: TValidationErrors = {};

    details.forEach(detail => {
      const key = String(detail.path[0]);
      const message = detail.message;
      result[key] = this.sliceKeyInError(key, message);
    });

    return result;
  }

  private sliceKeyInError(key: string, message: string): string {
    key = `"${key}"`;
    const startIndex = message.indexOf(key);
    message = message.slice(startIndex + key.length).trim();

    return message;
  }
}
