import { environment } from 'src/environments/environment';
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
import { LicenseAuthenticationService } from './licensor/license-authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private licenseAuthenticationService: LicenseAuthenticationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          if (err.url.indexOf(environment.apiUrl) >= 0) {
            this.authenticationService.logout();
          }

          if (err.url.indexOf(environment.licenseUrl) >= 0) {
            this.licenseAuthenticationService.getAccessForcely().subscribe();
          }
        }

        console.log(err);
        return throwError(err);
      })
    );
  }
}
