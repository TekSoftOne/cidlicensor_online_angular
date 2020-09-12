import { AuthenticationService } from './../authentication.service';
import { NgForm } from '@angular/forms';
import { AfterViewInit, Component } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ot-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'ot-body',
  },
})
export class LoginComponent implements AfterViewInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  public loading = false;
  public error: any;
  ngAfterViewInit(): void {}
  public onSubmitLogin(form: NgForm): void {
    if (!form.form.valid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(form.controls.email.value, form.controls.password.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.loading = false;
          this.error = err.error ?? err.message;
          return throwError(err);
        }),
        tap(() => this.router.navigateByUrl('dashboard')),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }
}
