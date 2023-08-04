import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class CustomException {
  public error: any;
  public fallbackMessage: any;

  constructor({
    error,
    fallbackMessage = 'Something went wrong',
  }: {
    error: any;
    fallbackMessage?: string;
  }) {
    this.error = error;
    this.fallbackMessage = fallbackMessage;

    throw this.throwError();
  }

  throwError() {
    if (this.error?.response) {
      throw this.error;
    }
    throw new BadRequestException(
      this.error?.message ?? this.fallbackMessage ?? 'Something went wrong',
    );
  }
}

export class GuardException extends CustomException {
  constructor(error: any) {
    super({ error });
  }

  throwError(): void {
    if (this.error?.response) {
      throw this.error;
    }
    throw new UnauthorizedException();
  }
}
