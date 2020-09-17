import { Observable, of } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
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
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'ot-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss'],
})
export class MobileVerificationComponent
  implements OnInit, IFormWizard, OnChanges {
  constructor(
    private toastrservice: ToastrService,
    private httpClient: HttpClient
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

    if (environment.production) {
      this.checkAndVerify()
        .pipe(
          tap((res) => {
            if (res) {
              this.data.emit({ verifyNumber: this.verifyNumber });
              return true;
            }

            throw Error('Verify Code is not valid!');
          }),
          tap(() => this.nextStep.emit(f)),
          catchError((err) => {
            this.toastrservice.error(err);
            return of(false);
          })
        )
        .subscribe();
    } else {
      this.nextStep.emit(f);
    }
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
        map((res) => res.isValid)
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phoneNumber && changes.phoneNumber.currentValue.length > 0) {
      this.SendCode().subscribe();
    }
  }

  ngOnInit(): void {}
}
