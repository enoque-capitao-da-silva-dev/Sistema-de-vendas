import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { CategoryAlreadyExistsError } from "../../application/errors/category-already-exists.error";
import { CategoryNotFoundError } from "../../application/errors/category-not-found.error";
 
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
      CategoryNotFoundError
    ) {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
    });
  }
}

