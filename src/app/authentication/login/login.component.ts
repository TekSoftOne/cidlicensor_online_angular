import { AuthenticationService } from './../authentication.service';
import { NgForm } from '@angular/forms';
import { AfterViewInit, Component } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isControlValid } from 'src/app/form';
import { ToastrService } from 'ngx-toastr';

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
    private toastrservice: ToastrService,
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
      .login(form.controls.userName.value, form.controls.password.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.loading = false;
          this.error = err.error ?? err.message;
          this.toastrservice.error(err.error, 'Error');
          return throwError(err);
        }),
        tap(() => this.router.navigateByUrl('track-your-request')),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }

  public checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
}
