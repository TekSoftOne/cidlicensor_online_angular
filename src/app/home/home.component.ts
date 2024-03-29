import { WizardAction } from './../wizards/wizard-actions';
import {
  getRequestStatus,
  getCurrentStep,
  getRequest,
  getPreviousSteps,
} from './../wizards/wizard-selectors';
import { WizardState } from './../wizards/interfaces';
import { LicenseAuthenticationService } from './../authentication/licensor/license-authentication.service';
import { AuthenticationService } from './../authentication/authentication.service';
import { LoginComponent } from './../authentication/login/login.component';
import { StateService } from './../state-service';
import { environment } from 'src/environments/environment';
import { getApplicationNumber } from '../wizards/wizard-selectors';
import {
  CURRENT_DATA_TOKEN,
  CURRENT_STEP_TOKEN,
  PREVIOUS_STEP_TOKEN,
  STEPS_PERSONAL,
  STEPS_LIMIT,
  STEPS_LOCATION,
  STEPS_SUBMIT,
  showHomeScreens,
  getStatusFromId,
  statuses,
  toBase64FromFile,
  monthlySalaryRanges,
  monthlyQuotaRanges,
  customerTypes,
  newRequest,
  paymentTypes,
  requestCategories,
  getOpenType,
} from './../constants';
import {
  MembershipRequest,
  CustomValidation,
  CreateUserResult,
  LicenseMembershipInfo,
  MembershipRequestResult,
  PaymentInfoLicensor,
} from './../interfaces';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  combineLatest,
  observable,
  VirtualTimeScheduler,
  forkJoin,
} from 'rxjs';
import { catchError, last, map, skip, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { createRandomPass } from '../authentication/password-generator';
import {
  stepsAll,
  showPreviousButtonScreens,
  showNextButtonScreensAll,
  showStepsFlowScreens,
} from '../constants';

import { ToastrService } from 'ngx-toastr';
import { Router, RouterStateSnapshot } from '@angular/router';
import { OnlineRequestService } from '../authentication/online-request.service';
import { select, Store } from '@ngrx/store';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'ot-home',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'ot-body',
  },
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public isNextButtonShowed: Observable<boolean>;
  public isPreviousButtonShowed: Observable<boolean>;
  public isStepsFlowShowed: Observable<boolean>;
  public isHomeShowed: Observable<boolean>;
  public isSearchStep: Observable<boolean>;

  public previousSteps$: Observable<string[]>;
  public currentStep$: Observable<string>;
  public applicationNumber$: Observable<number>;
  // public applicationNumber: Observable<number>;
  public isApprovedOrRejected$: Observable<boolean>;
  public isCheckingEmirateIDNumber$: BehaviorSubject<boolean>;
  public disableSubmit: Observable<boolean>;
  public reachSubmitStep$: Observable<boolean>;
  public disableButtons$: BehaviorSubject<boolean>;

  public isMobileSend = false;
  public googleApiLoad: any;
  public error: string;
  public nextButtonsOnScreens: string[] = [];
  options = {
    center: { lat: 40, lng: -20 },
    zoom: 4,
  };

  // for compatibility between Licensor and Online
  public monthlyQuotaIdMax = Math.max(...monthlySalaryRanges.map((s) => s.id));
  public monthlySalaryIdMax = Math.max(...monthlyQuotaRanges.map((s) => s.id));

  public openType = 'New'; // Update/New
  public updating = false;
  public requestValidation: CustomValidation[] = [];
  public requestStatus$: Observable<number>;
  public request$: Observable<MembershipRequestResult>;
  public submit$: Observable<string>;

  constructor(
    private httpClient: HttpClient,
    private toastrservice: ToastrService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    public stateService: StateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store<WizardState>
  ) {
    this.disableButtons$ = new BehaviorSubject<boolean>(false);
    this.isCheckingEmirateIDNumber$ = new BehaviorSubject<boolean>(false);
    this.previousSteps$ = this.store.pipe(select(getPreviousSteps));
    this.requestStatus$ = this.store.pipe(select(getRequestStatus));
    this.applicationNumber$ = this.store.pipe(select(getApplicationNumber));
    this.request$ = this.store.pipe(select(getRequest));

    this.licenseAuthenticationService.getAccessSilently().subscribe();

    const state: RouterStateSnapshot = router.routerState.snapshot;
    if (state.url.indexOf('?ref=') > 0) {
      const orderRef = state.url.replace('/?ref=', '');
      const url = `/checkout?orderRef=${orderRef}`;
      this.router.navigateByUrl(url);
    }

    this.isApprovedOrRejected$ = this.requestStatus$.pipe(
      map((status) => {
        return (
          getStatusFromId(status) === 'Approved' ||
          getStatusFromId(status) === 'Rejected'
        );
      })
    );

    this.currentStep$ = this.store
      .pipe(select(getCurrentStep))
      .pipe(tap(console.log));

    this.reachSubmitStep$ = this.currentStep$.pipe(
      map((step) => {
        if (step === 'sReview') {
          return true;
        }
        return false;
      })
    );

    this.nextButtonsOnScreens = showNextButtonScreensAll;

    this.disableSubmit = combineLatest([
      this.reachSubmitStep$,
      this.isApprovedOrRejected$,
      this.isCheckingEmirateIDNumber$,
    ]).pipe(
      map(([submit, approved, checkingEmirateNumberId]) => {
        if ((submit && approved) || checkingEmirateNumberId === true) {
          return true;
        }

        return false;
      })
    );

    this.isNextButtonShowed = this.currentStep$.pipe(
      map((s) => this.nextButtonsOnScreens.includes(s))
    );

    this.isPreviousButtonShowed = combineLatest([
      this.currentStep$,
      this.previousSteps$,
    ]).pipe(
      map(([currentStep, previousSteps]) => {
        return (
          showPreviousButtonScreens.includes(currentStep) &&
          previousSteps.length > 0
        );
      })
    );

    this.isStepsFlowShowed = this.currentStep$.pipe(
      map((s) => showStepsFlowScreens.includes(s))
    );

    this.isHomeShowed = this.currentStep$.pipe(
      map((s) => showHomeScreens.includes(s))
    );

    this.isSearchStep = this.currentStep$.pipe(map((s) => s === 'sSearch'));
  }

  public updateData(request: MembershipRequestResult): void {
    this.store.dispatch(new WizardAction.MergeRequestData(request));
  }

  public updateSearchMembershipData(request: MembershipRequestResult): void {
    this.updateData(request);
  }

  public updateValidation(validation: CustomValidation): void {
    const existed = this.requestValidation.find(
      (x) => x.controlName === validation.controlName
    );
    if (!existed) {
      this.requestValidation.push(validation);
      return;
    }

    existed.isValid = validation.isValid;
  }

  public searchRequest(f: NgForm): void {
    if (!f.form.valid) {
      return;
    }

    this.store.dispatch(new WizardAction.Search());
  }

  public sendMobile(): void {
    this.isMobileSend = true;
  }

  public loadPreviousSteps(): string[] {
    const cacheSteps = localStorage.getItem(PREVIOUS_STEP_TOKEN);
    if (!cacheSteps) {
      return [];
    }

    return JSON.parse(cacheSteps);
  }

  public isFormValid(form: NgForm): boolean {
    return form.invalid && (form.dirty || form.touched || form.submitted);
  }

  public isControlValid(form: NgForm, control: any): boolean {
    return (
      control &&
      control.invalid &&
      (control.dirty || control.touched || form.submitted)
    );
  }

  public next(f: NgForm): void {
    if (environment.enableValidation) {
      if (
        !f.form.valid ||
        this.requestValidation.filter((x) => !x.isValid).length > 0
      ) {
        console.log('invalid');
        return;
      }
    }

    this.store.dispatch(new WizardAction.Next());

    if (this.stateService.state.currentStep === 'sApplicationIdNotice') {
      if (
        !this.stateService.state.request.email ||
        !this.stateService.state.request.fullName ||
        !this.stateService.state.request.phoneNumber
      ) {
        this.toastrservice.error('Email and PhoneNumber is required');
        return;
      }

      this.processApplication().subscribe();
      return;
    }

    this.requestValidation = [];
  }

  public previous(): void {
    this.store.dispatch(new WizardAction.Previous());
  }

  public submitRequest(): void {
    this.store.dispatch(new WizardAction.SubmitRequest());
    this.processApplication().subscribe();
  }

  private processApplication(): Observable<any> {
    this.updating = true;
    // tslint:disable-next-line: max-line-length
    this.openType = this.stateService.state.openType; // copy here to make sure open type should not be changed while creating/updating request
    return this.generateMembershipNumber().pipe(
      tap((membershipNo) =>
        this.store.dispatch(
          new WizardAction.CreateMembershipNumberSuccess(membershipNo)
        )
      ),

      switchMap(() => this.createLicensorRequest()),
      switchMap((membershipInfo) => {
        this.store.dispatch(
          new WizardAction.CreateMembershipNumberSuccess(
            membershipInfo.membershipNumber
          )
        );
        this.store.dispatch(
          new WizardAction.CreateMembershipIdSuccess(
            membershipInfo.membershipId
          )
        );
        return of(membershipInfo);
      }),
      switchMap(() => {
        return forkJoin([
          this.createApplication(),
          this.logPaymentInLicensor(),
        ]).pipe(
          map(([applicationNumber, _]) => {
            return applicationNumber;
          })
        );
      }),
      tap(() => {
        this.authenticationService.updateCustomerType(
          this.stateService.state.request.membershipTypeId
        );
      }),
      tap(() => {
        this.licenseAuthenticationService.removeAccessCache();
      }),
      tap(() => (this.updating = false)),
      tap((appNumber) => {
        this.store.dispatch(
          new WizardAction.CreateApplicationSuccess(appNumber)
        );
      }),
      map(() => true),
      catchError((err) => {
        console.log(err);
        this.updating = false;
        err.error
          ? this.toastrservice.error(err.error)
          : this.toastrservice.error(err);
        return of(false);
      })
    );
  }

  private logPaymentInLicensor(): Observable<any> {
    if (this.stateService.state.openType === 'New') {
      return this.licenseAuthenticationService.post(
        `${environment.licenseUrl}/api/membershipsPayment/addMembershipPaymentInfo`,
        {
          membershipId: this.stateService.state.request.membershipId,
          membershipNumber: this.stateService.state.request.membershipNumber,
          paymentType: paymentTypes.find(
            (p) => p.name === this.stateService.state.request.paymentType
          ).id,
          requestCategory: requestCategories.find(
            (r) => r.name === this.stateService.state.request.requestCategory
          ).id,
          orderRefNumber: this.stateService.state.request.orderRef,
          amount: 270,
        } as PaymentInfoLicensor
      );
    }

    return of(true);
  }

  private generateMembershipNumber(): Observable<string> {
    if (
      this.stateService.state.request.membershipNumber &&
      this.stateService.state.request.membershipNumber.length > 1
    ) {
      return of(this.stateService.state.request.membershipNumber);
    }

    return this.licenseAuthenticationService.get(
      `${environment.licenseUrl}/api/salesPoint/generateMemberShipNumber`
    );
  }

  private createRequestMembership(): Observable<number> {
    return this.makeFormData().pipe(
      switchMap((d) => {
        return this.httpClient
          .post(`${environment.apiUrl}/api/membershipRequests/update`, d)
          .pipe(map((appId) => appId as number));
      })
    );
  }

  private createApplication(): Observable<number> {
    return this.createRequestMembership();
  }

  private makeFormData(): Observable<FormData> {
    return toBase64FromFile(this.stateService.state.request.profilePhoto).pipe(
      map((photo) => {
        const f = new FormData();
        for (const key in this.stateService.state.request) {
          if (key) {
            // alway change status to pendind whenever updating
            if (key === 'status') {
              f.append(
                key,
                statuses.find((s) => s.name === 'Pending')?.id.toString()
              );
            } else {
              f.append(
                key,
                this.stateService.state.request[key] === 'null' ||
                  this.stateService.state.request[key] === null
                  ? ''
                  : this.stateService.state.request[key]
              );
            }

            // Occupation = FullAddress
            if (key === 'fullAddress') {
              f.append('occupation', this.stateService.state.request[key]);
            }

            if (key === 'emiratesIdBack') {
              f.append('attachment1', this.stateService.state.request[key]);
            }

            if (key === 'profilePhoto') {
              // file to string
              f.append('profilePic', photo); // string
            }

            if (key === 'monthlySalary') {
              f.append(
                'salary',
                this.stateService.state.request[key].toString()
              );
            }

            if (key === 'monthlyQuota') {
              f.append(
                'limit',
                this.stateService.state.request[key].toString()
              );
            }
          }
        }
        return f;
      })
    );
  }

  private createLicensorRequest(): Observable<LicenseMembershipInfo> {
    return this.makeFormData().pipe(
      switchMap((d) =>
        this.licenseAuthenticationService.request(
          `${environment.licenseUrl}/api/SalesPoint/AddNewMembership`,
          d
        )
      )
    );
  }

  private cacheCurrentStep(step: string, previousSteps: string[]): void {
    if (!environment.production) {
      if (environment.enableTestData) {
        localStorage.setItem(CURRENT_STEP_TOKEN, step);
        localStorage.setItem(
          PREVIOUS_STEP_TOKEN,
          JSON.stringify(previousSteps)
        );
      }
    }
  }

  public isPersonalLeftStep(step: string): boolean {
    return STEPS_PERSONAL.findIndex((s) => s === step) >= 0;
  }

  public isLimitLeftStep(step: string): boolean {
    return STEPS_LIMIT.findIndex((s) => s === step) >= 0;
  }

  public isSubmitLeftStep(step: string): boolean {
    return STEPS_SUBMIT.findIndex((s) => s === step) >= 0;
  }

  public isLocationLeftStep(step: string): boolean {
    return STEPS_LOCATION.findIndex((s) => s === step) >= 0;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
