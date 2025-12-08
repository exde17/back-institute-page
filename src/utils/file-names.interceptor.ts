import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileNamesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.files) {
      const fileData = {};

      // Mapear archivos a propiedades de la entidad
      Object.keys(request.files).forEach((fieldname) => {
        const file = request.files[fieldname];
        if (file && file.filename) {
          fileData[fieldname] = file.filename;
        }
      });

      request.body = { ...request.body, ...fileData };
    }

    return next.handle();
  }
}
