import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { CategoryAlreadyExistsError } from "../../application/errors/category-already-exists.error";
import { CategoryNotFoundError } from "../../application/errors/category-not-found.error";
import { CategoryCannotBeReactivatedError } from "../../application/errors/category-cannot-be-reactivated.error";
import { MyCustomError } from '../../errors/my-custom.error';
import { IdempotencyKeyAlreadyExistsError } from '../../application/errors/idempotency-key-already-exists.error';

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const response =
      host.switchToHttp().getResponse();

    if (
      exception instanceof
      CategoryAlreadyExistsError
    ) {
      return response.status(409).json({
        statusCode: 409,
        message: exception.message,
      });
    }
    
    if (
      exception instanceof
      IdempotencyKeyAlreadyExistsError
    ) {
      return response.status(409).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    if (
      exception instanceof
      CategoryNotFoundError
    ) {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    } 

    if (exception instanceof MyCustomError) {
      return response.status(exception.code).json({
        statusCode: exception.code,
        message: exception.message,
      });
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
      //message: exception.message,
    });
  }
}

