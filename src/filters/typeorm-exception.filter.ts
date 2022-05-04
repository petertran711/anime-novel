import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { TypeORMError } from "typeorm";

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response : Response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const name = exception.name;
    const message = exception.message;
    const stack = exception.stack;

    response
      .status(500)
      .json({
        statusCode: 500,
        name: name,
        message: message,
        stack: stack,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}