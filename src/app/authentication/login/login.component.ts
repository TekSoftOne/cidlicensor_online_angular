import { AuthenticationService } from './../authentication.service';
import { NgForm } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isControlValid } from 'src/app/form';
import { ToastrService } from 'ngx-toastr';
import * as nationPickerHelper from '../../nation-picker-helper.js';
import { VerificationModel, VerificationSendResult } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

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
  public showPhoneNumber = true;
  constructor(
    private authenticationService: AuthenticationService,
    private toastrservice: ToastrService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.codeSent$ = new BehaviorSubject<boolean>(false);
  }

  public loading = false;
  public error: any;
  public codeSent$: BehaviorSubject<boolean>;
  public sendPhoneResult: Observable<boolean>;
  private phoneNumber: string;

  ngAfterViewInit(): void {
    nationPickerHelper();
  }
  public login(phoneNumber: string): void {
    this.loading = true;
    this.authenticationService
      .login(phoneNumber, undefined)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.loading = false;
          this.error = err.error ?? err.message;
          this.toastrservice.error(err.error, 'Error');
          return throwError(err);
        })
      )
      .subscribe();
  }

  public checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }

  public onSendPhone(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    this.loading = true;
    this.httpClient
      .post(`${environment.apiUrl}/api/phoneVerification/check`, {
        phoneNumber: form.controls.phoneNumber.value,
      } as VerificationModel)
      .pipe(
        tap(() => this.codeSent$.next(true)),
        tap(() => (this.loading = false)),
        tap(() => (this.phoneNumber = form.controls.phoneNumber.value)),
        tap(() => this.router.navigateByUrl('track-your-request')),
        tap(() => (this.loading = false))
      )

      .subscribe();
  }

  public onSendCode(form: NgForm): Observable<boolean> {
    if (!form.valid) {
      return;
    }

    this.verifyCode(this.phoneNumber, form.controls.verifyCode.value)
      .pipe(
        map((res) => {
          if (!res) {
            throw new Error('The verify code is not valid');
          }
        }),
        tap(() => this.login(this.phoneNumber)),
        catchError((err) => {
          this.toastrservice.error(err);
          return of(undefined);
        })
      )
      .subscribe();
  }

  private verifyCode(phoneNumber: string, code: string): Observable<boolean> {
    if (!environment.production) {
      return of(true);
    }

    return this.httpClient
      .post(`${environment.apiUrl}/api/phoneVerification/checkCode`, {
        phoneNumber,
        code,
      } as VerificationModel)
      .pipe(
        map((data) => data as VerificationSendResult),
        map((res) => res.isValid)
      );
  }
}
