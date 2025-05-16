import { ValidationError } from '@/shared/errors/validation.error';
import { validate, ValidationError as InvalidError } from 'class-validator';

export async function validateDto(dto: object): Promise<void> {
  const errors: InvalidError[] = await validate(dto);

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}
