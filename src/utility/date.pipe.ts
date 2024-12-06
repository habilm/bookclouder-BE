import {
  BadRequestException,
  ParseIntPipeOptions,
  PipeTransform,
} from '@nestjs/common';

export class ParseDatePipe implements PipeTransform<string> {
  protected readonly options?: ParseIntPipeOptions;
  protected exceptionFactory: (error: string) => any;
  constructor() {}
  /**
   * Method that accesses and performs optional transformation on argument for
   * in-flight requests.
   *
   * @param value currently processed route argument
   * @param metadata: ArgumentMetadata contains metadata about the currently processed route argument
   */
  async transform(value: string): Promise<Date> {
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException({
        message: 'Invalid date',
        error: 'Validation Error',
      });
    }
    return parsedDate;
  }
}
