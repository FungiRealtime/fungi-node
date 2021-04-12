import { CustomError } from 'ts-custom-error';

export class HttpError extends CustomError {
  public constructor(public statusCode: number, message: string) {
    super(message);
  }
}
