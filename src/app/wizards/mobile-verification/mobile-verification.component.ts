import { StateService } from './../../state-service';
import { OnlineRequestService } from './../../authentication/online-request.service';
import { Observable, of, throwError } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  CreateUserResult,
  IFormWizard,
  VerificationModel,
  VerificationSendResult,
} from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { isFormValid } from 'src/app/form';
import { MembershipRequest } from 'src/app/interfaces';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { UserToken } from 'src/app/authentication/interface';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'ot-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss'],
})
export class MobileVerificationComponent
  implements OnInit, IFormWizard, OnChanges {
  public loading = false;
  constructor(
    private toastrservice: ToastrService,
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private stateService: StateService
  ) {}

  @Input() verifyNumber: string;
  @Input() phoneNumber: string;
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  checkControlInvalid(form: NgForm, control: any): boolean {
    throw new Error('Method not implemented.');
  }
  next(f: NgForm): void {
    if (!f.valid) {
      this.toastrservice.error('Verification Number need to be 6 charaters!');
      return;
    }

    this.loading = true;
    this.checkAndVerify()
      .pipe(
        switchMap(() => this.createUser()),
        switchMap(() => this.login(this.phoneNumber)),
        tap((res) => {
          this.data.emit({ verifyNumber: this.verifyNumber });
          this.loading = false;
        }),
        tap(() => this.nextStep.emit(f)),
        catchError((err) => {
          this.toastrservice.error(err);
          this.loading = false;
          return of(false);
        })
      )
      .subscribe();
  }
  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }

  public SendCode(): Observable<VerificationSendResult> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/phoneVerification/check`, {
        phoneNumber: this.phoneNumber,
      } as VerificationModel)
      .pipe(map((data) => data as VerificationSendResult));
  }

  private checkAndVerify(): Observable<boolean> {
    if (!environment.production) {
      return of(true);
    }

    if (!this.phoneNumber) {
      return of(false);
    }

    return this.VerifyCode();
  }

  private VerifyCode(): Observable<boolean> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/phoneVerification/checkCode`, {
        phoneNumber: this.phoneNumber,
        code: this.verifyNumber,
      } as VerificationModel)
      .pipe(
        map((data) => data as VerificationSendResult),
        map((res) => {
          if (!res.isValid) {
            throw new Error('Verify Code is invalid!');
          }

          return true;
        })
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phoneNumber && changes.phoneNumber.currentValue.length > 0) {
      if (environment.production) {
        this.SendCode().subscribe();
      }
    }
  }

  private createUser(): Observable<CreateUserResult> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/users/register`, {
        phoneNumber: this.phoneNumber,
        email: this.phoneNumber,
        fullName: undefined,
        undefined,
      })
      .pipe(
        map((res) => res as CreateUserResult),
        tap((registerResult) => {
          if (
            !registerResult.succeeded &&
            registerResult.errors &&
            registerResult.errors.length > 0
          ) {
            if (registerResult.errors[0].code !== 'DuplicateUserName') {
              throw new Error(registerResult.errors[0].code);
            }
          }
        })
      );
  }

  public login(phoneNumber: string): Observable<UserToken> {
    return this.authenticationService.login(phoneNumber, undefined).pipe(
      tap(() => this.stateService.refresh()),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  ngOnInit(): void {}
}
