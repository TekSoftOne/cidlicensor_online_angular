import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private toastrservice: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
        }

        console.log(err);
        return throwError(err);
      })
    );
  }
}
