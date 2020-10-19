import { LicenseAuthenticationService } from './../authentication/licensor/license-authentication.service';
import { AuthenticationService } from './../authentication/authentication.service';
import { LoginComponent } from './../authentication/login/login.component';
import { StateService } from './../state-service';
import { environment } from 'src/environments/environment';
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
} from 'rxjs';
import { catchError, last, map, switchMap, tap } from 'rxjs/operators';
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

  private readonly defaultStep = 'sPhoneNumber';
  public currentStep: Observable<string>;
  public previousSteps$: BehaviorSubject<string[]>;
  public isMobileSend = false;
  public googleApiLoad: any;
  public applicationNumber$: BehaviorSubject<number>;
  public applicationNumber: Observable<number>;
  public error: string;
  public steps: string[] = [];

  public disableSubmit: Observable<boolean>;
  public reachSubmitStep$: BehaviorSubject<boolean>;
  public isApprovedRequest$: BehaviorSubject<boolean>;
  public isApprovedRequest: Observable<boolean>;

  public disableButtons$: BehaviorSubject<boolean>;

  public nextButtonsOnScreens: string[] = [];
  constructor(
    private httpClient: HttpClient,
    private toastrservice: ToastrService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    public stateService: StateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private onlineRequestService: OnlineRequestService
  ) {
    this.licenseAuthenticationService.getAccessSilently().subscribe();

    this.openType =
      this.stateService.data.request.applicationNumber > 0 ? 'Update' : 'New';

    this.onlineRequestService
      .get(`${environment.apiUrl}/api/common/countries`)
      .subscribe();

    const state: RouterStateSnapshot = router.routerState.snapshot;
    if (state.url.indexOf('?ref=') > 0) {
      const orderRef = state.url.replace('/?ref=', '');
      const url = `/checkout?orderRef=${orderRef}`;
      this.router.navigateByUrl(url);
    }

    this.disableButtons$ = new BehaviorSubject<boolean>(false);

    this.steps = this.stateService.getSteps(this.stateService.data.request);

    this.currentStep = this.stateService.currentStep$.asObservable();

    this.nextButtonsOnScreens = showNextButtonScreensAll;

    this.previousSteps$ = new BehaviorSubject<string[]>(
      this.loadPreviousSteps()
    );

    this.reachSubmitStep$ = new BehaviorSubject<boolean>(false);
    this.isApprovedRequest$ = new BehaviorSubject<boolean>(false);
    this.isApprovedRequest = this.isApprovedRequest$.asObservable();
    this.disableSubmit = combineLatest([
      this.reachSubmitStep$,
      this.isApprovedRequest$,
    ]).pipe(
      map(([submit, approved]) => {
        if (submit && approved) {
          return true;
        }

        return false;
      })
    );

    this.applicationNumber$ = new BehaviorSubject<number>(
      this.stateService.data.request?.applicationNumber
    );

    this.applicationNumber = this.applicationNumber$.asObservable().pipe(
      tap((application) => {
        if (
          (!this.stateService.data.request.applicationNumber ||
            this.stateService.data.request.applicationNumber < 0) &&
          this.stateService.data.request
        ) {
          this.stateService.data.request = {
            ...this.stateService.data.request,
            membershipRequestType: 2, // always = 2 whatever,
          };

          if (application > 0) {
            this.openType = 'Update';
          }
        }
      }),
      tap(() => this.isApprovedRequest$.next(this.isApproved()))
    );

    this.isNextButtonShowed = this.currentStep.pipe(
      map((s) => this.nextButtonsOnScreens.includes(s))
    );

    this.isPreviousButtonShowed = this.currentStep.pipe(
      map((s) => {
        return (
          showPreviousButtonScreens.includes(s) &&
          this.previousSteps$.value.length > 0
        );
      })
    );

    this.isStepsFlowShowed = this.currentStep.pipe(
      map((s) => showStepsFlowScreens.includes(s))
    );

    this.isHomeShowed = this.currentStep.pipe(
      map((s) => showHomeScreens.includes(s))
    );

    this.isSearchStep = this.currentStep.pipe(map((s) => s === 'sSearch'));
  }
  options = {
    center: { lat: 40, lng: -20 },
    zoom: 4,
  };

  // for compatibility between Licensor and Online
  public monthlyQuotaIdMax = Math.max(...monthlySalaryRanges.map((s) => s.id));
  public monthlySalaryIdMax = Math.max(...monthlyQuotaRanges.map((s) => s.id));

  public openType = 'New'; // Update

  public updateStatus: Observable<boolean>;

  public requestValidation: CustomValidation[] = [];

  public updateData(request: MembershipRequestResult): void {
    this.stateService.data.request = {
      ...this.stateService.data.request,
      ...request,
    };
  }

  public updateSearchMembershipData(request: MembershipRequestResult): void {
    this.updateData({
      ...request,
      requestCategory: this.stateService.data.request.requestCategory,
    });
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
    this.setCurrentStep('sPersonalBasic');
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

  public isApproved(): boolean {
    return (
      getStatusFromId(this.stateService.data.request.status) === 'Approved'
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

    const index = this.getIndex(this.stateService.currentStep$.value);

    let step = this.steps[index + 1];

    if (!this.stateService.data.request.phoneNumber) {
      // user get to home page from last session
      this.stateService.data.request.phoneNumber = this.authenticationService.getUser().email;
    }

    if (this.stateService.currentStep$.value === 'sReview') {
      if (
        !this.stateService.data.request.email ||
        !this.stateService.data.request.fullName ||
        !this.stateService.data.request.phoneNumber
      ) {
        this.toastrservice.error('Email and PhoneNumber is required');
        return;
      }

      this.updateStatus = this.processApplication();
    }

    if (
      step === 'sSearch' &&
      this.stateService.data.request.requestCategory === 'New'
    ) {
      // dont want to search if (New)
      step = this.steps[this.getIndex(step) + 1];
    }

    const previousSteps = this.previousSteps$.value;
    previousSteps.push(this.stateService.currentStep$.value);

    this.previousSteps$.next(previousSteps);
    this.stateService.currentStep$.next(step);
    this.checkSubmitAllowance(step);
    this.cacheCurrentStep(step, this.previousSteps$.value);
    this.requestValidation = [];
  }

  public submitRequest(): void {
    this.stateService.currentStep$.next('sApplicationIdNotice');
    this.updateStatus = this.processApplication();
  }

  private checkSubmitAllowance(step: string): void {
    if (step === 'lastDiv') {
      this.reachSubmitStep$.next(true);
    } else {
      this.reachSubmitStep$.next(false);
    }
  }

  private processApplication(): Observable<boolean | undefined> {
    return this.generateMembershipNumber().pipe(
      tap(
        (membershipNo) =>
          (this.stateService.data.request.membershipNumber = membershipNo)
      ),

      switchMap(() => this.createLicensorRequest()),
      switchMap((membershipInfo) => {
        this.stateService.data.request.membershipNumber =
          membershipInfo.membershipNumber;
        this.stateService.data.request.membershipId =
          membershipInfo.membershipId;
        return of(membershipInfo);
      }),
      switchMap((membershipInfo: LicenseMembershipInfo) =>
        this.createApplication(membershipInfo)
      ),
      map((appResult) => {
        this.applicationNumber$.next(appResult);
      }),
      switchMap(() => this.logPaymentInLicensor()),
      tap(() => this.licenseAuthenticationService.removeAccessCache()),
      map(() => true),
      catchError((err) => {
        err.error
          ? this.toastrservice.error(err.error)
          : this.toastrservice.error(err);
        return of(false);
      })
    );
  }

  private logPaymentInLicensor(): Observable<any> {
    if (this.openType === 'New') {
      return this.licenseAuthenticationService.post(
        `${environment.licenseUrl}/api/membershipsPayment/addMembershipPaymentInfo`,
        {
          membershipId: this.stateService.data.request.membershipId,
          membershipNumber: this.stateService.data.request.membershipNumber,
          paymentType: paymentTypes.find(
            (p) => p.name === this.stateService.data.request.paymentType
          ).id,
          requestCategory: requestCategories.find(
            (r) => r.name === this.stateService.data.request.requestCategory
          ).id,
          orderRefNumber: this.stateService.data.request.orderRef,
          amount: 270,
        } as PaymentInfoLicensor
      );
    }

    return of(true);
  }

  private generateMembershipNumber(): Observable<string> {
    if (
      this.stateService.data.request.membershipNumber &&
      this.stateService.data.request.membershipNumber.length > 1
    ) {
      return of(this.stateService.data.request.membershipNumber);
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

  private createApplication(
    membershipInfo: LicenseMembershipInfo
  ): Observable<number> {
    this.stateService.data.request.membershipNumber =
      membershipInfo.membershipNumber;
    this.stateService.data.request.membershipId = membershipInfo.membershipId;
    return this.createRequestMembership().pipe(
      tap((appId) => (this.stateService.data.request.applicationNumber = appId))
    );
  }

  private makeFormData(): Observable<FormData> {
    return toBase64FromFile(this.stateService.data.request.profilePhoto).pipe(
      map((photo) => {
        const f = new FormData();
        for (const key in this.stateService.data.request) {
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
                this.stateService.data.request[key] === 'null' ||
                  this.stateService.data.request[key] === null
                  ? ''
                  : this.stateService.data.request[key]
              );
            }

            // Occupation = FullAddress
            if (key === 'fullAddress') {
              f.append('occupation', this.stateService.data.request[key]);
            }

            if (key === 'emiratesIdBack') {
              f.append('attachment1', this.stateService.data.request[key]);
            }

            if (key === 'profilePhoto') {
              // file to string
              f.append('profilePic', photo); // string
            }

            if (key === 'monthlySalary') {
              f.append(
                'salary',
                this.stateService.data.request[key].toString()
              );
            }

            if (key === 'monthlyQuota') {
              f.append('limit', this.stateService.data.request[key].toString());
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

  private getIndex(value: string): number {
    return this.steps.findIndex((x) => x === value);
  }

  public previous(): void {
    let lastOne = this.previousSteps$.value.pop();
    if (lastOne === 'sSearch') {
      lastOne = this.previousSteps$.value.pop();
    }
    this.stateService.currentStep$.next(lastOne);
    this.checkSubmitAllowance(lastOne);
    this.requestValidation = [];
  }

  private setCurrentStep(step: string): void {
    this.stateService.currentStep$.next(step);
    this.cacheCurrentStep(step, this.previousSteps$.value);
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
