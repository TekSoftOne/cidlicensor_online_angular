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
} from './../constants';
import {
  MembershipRequest,
  CustomValidation,
  CreateUserResult,
  LicenseMembershipInfo,
} from './../interfaces';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { createRandomPass } from '../authentication/password-generator';
import {
  stepsAll,
  showPreviousButtonScreens,
  showNextButtonScreensAll,
  showStepsFlowScreens,
} from '../constants';

import { ToastrService } from 'ngx-toastr';

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
  public currentStep$: BehaviorSubject<string>;
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

  public nextButtonsOnScreens: string[] = [];
  constructor(
    private httpClient: HttpClient,
    private toastrservice: ToastrService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    private stateService: StateService,
    private authenticationService: AuthenticationService
  ) {
    this.steps = stepsAll.filter((s) => {
      if (
        this.authenticationService.getUser() &&
        (s === 'sPhoneNumber' || s === 'sVerifyPhone')
      ) {
        return false;
      }

      if (
        this.authenticationService.getUser() &&
        s === 'sSearch' &&
        this.request.membershipNumber
      ) {
        return false;
      }

      return true;
    });

    this.nextButtonsOnScreens = showNextButtonScreensAll;

    this.currentStep$ = new BehaviorSubject<string>(this.loadCurrentStep());
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
          (!this.request.applicationNumber ||
            this.request.applicationNumber < 0) &&
          this.stateService.data.request
        ) {
          this.request = {
            ...this.stateService.data.request,
            membershipRequestType: 2, // always = 2 whatever
          };
          this.openType = 'Update';
        }
      }),
      tap(() => this.isApprovedRequest$.next(this.isApproved()))
    );

    this.isNextButtonShowed = this.currentStep$.pipe(
      map((s) => this.nextButtonsOnScreens.includes(s))
    );

    this.isPreviousButtonShowed = this.currentStep$.pipe(
      map((s) => showPreviousButtonScreens.includes(s))
    );

    this.isStepsFlowShowed = this.currentStep$.pipe(
      map((s) => showStepsFlowScreens.includes(s))
    );

    this.isHomeShowed = this.currentStep$.pipe(
      map((s) => showHomeScreens.includes(s))
    );

    this.isSearchStep = this.currentStep$.pipe(map((s) => s === 'sSearch'));
  }
  options = {
    center: { lat: 40, lng: -20 },
    zoom: 4,
  };

  public request: MembershipRequest = {
    nationId: 0,
    religionId: 0,
    gender: 0,
    areaId: '0',
    membershipNumber: '0',
    membershipRequestType: 2,
    status: statuses.find((s) => s.name === 'Pending')?.id,
  };

  public openType = 'New'; // Update

  public updateStatus: Observable<boolean>;

  public requestValidation: CustomValidation[] = [];

  public updateData(request: MembershipRequest): void {
    this.request = { ...this.request, ...request };
  }

  public updateSearchMembershipData(request: MembershipRequest): void {
    this.updateData({
      ...request,
      requestCategory: this.request.requestCategory,
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

  public loadCurrentStep(): string {
    const cacheStep = localStorage.getItem(CURRENT_STEP_TOKEN);
    if (cacheStep) {
      return cacheStep;
    }

    return this.steps[0];
  }

  public loadPreviousSteps(): string[] {
    const cacheSteps = localStorage.getItem(PREVIOUS_STEP_TOKEN);
    if (!cacheSteps) {
      return [];
    }

    return JSON.parse(cacheSteps);
  }

  public loadCurrentData(): MembershipRequest {
    const cacheData = localStorage.getItem(CURRENT_DATA_TOKEN);
    if (cacheData) {
      return JSON.parse(cacheData);
    }
    return {};
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
    return getStatusFromId(this.request.status) === 'Approved';
  }

  public next(f: NgForm): void {
    // if (
    //   !f.form.valid ||
    //   this.requestValidation.filter((x) => !x.isValid).length > 0
    // ) {
    //   console.log('invalid');
    //   return;
    // }
    const index = this.getIndex(this.currentStep$.value);

    let step = this.steps[index + 1];

    if (
      this.currentStep$.value === 'sTypeOfRequest' &&
      this.request.requestCategory === 'New'
    ) {
      step = this.steps[index + 2];
    } else if (this.currentStep$.value === 'sReview') {
      if (
        !this.request.email ||
        !this.request.fullName ||
        !this.request.phoneNumber
      ) {
        this.toastrservice.error('Email and PhoneNumber is required');
        return;
      }

      this.updateStatus = this.processApplication();
    } else if (
      this.currentStep$.value === 'sTypeOfCustomer' &&
      this.request.typeOfCustomer === 'Tourist'
    ) {
      this.request.requestCategory = 'New';
      if (this.request.applicationNumber) {
        // tourist only have New, not Replacement or Renew
        step = this.steps[index + 2]; // jum over New/Search -> another jumps in another place handled Jump Search already
      } else {
        step = this.steps[index + 3]; // jump over New/Search
      }
    }

    const previousSteps = this.previousSteps$.value;
    previousSteps.push(this.currentStep$.value);

    this.previousSteps$.next(previousSteps);
    this.currentStep$.next(step);
    this.checkSubmitAllowance(step);
    this.cacheCurrentStep(step, this.previousSteps$.value);
    this.requestValidation = [];
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
      tap((membershipNo) => (this.request.membershipNumber = membershipNo)),
      switchMap(() => this.createLicensorRequest()),
      switchMap((membershipInfo: LicenseMembershipInfo) =>
        this.createApplication(membershipInfo)
      ),
      map((appResult) => {
        this.applicationNumber$.next(appResult);
      }),
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

  private generateMembershipNumber(): Observable<string> {
    if (
      this.request.membershipNumber &&
      this.request.membershipNumber.length > 1
    ) {
      return of(this.request.membershipNumber);
    }

    return this.licenseAuthenticationService.get(
      `${environment.licenseUrl}/api/salesPoint/generateMemberShipNumber`
    );
  }

  private createUser(): Observable<CreateUserResult> {
    const password = environment.production ? createRandomPass(5, 3) : '123456';

    console.log(password);
    this.request.randomPass = password;
    return this.httpClient
      .post(`${environment.apiUrl}/api/users/register`, {
        phoneNumber: this.request.phoneNumber,
        email: this.request.email,
        fullName: this.request.fullName,
        password,
      })
      .pipe(
        map((res) => ({ ...res, password } as CreateUserResult)),
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

  private createRequestMembership(): Observable<number> {
    return this.httpClient
      .post(
        `${environment.apiUrl}/api/membershipRequests/update`,
        this.makeFormData()
      )
      .pipe(map((appId) => appId as number));
  }

  private sendRegistration(): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/Users/SendRegisterInformation`, {
        userName: this.request.email,
        email: this.request.email,
        fullName: this.request.fullName,
        password: undefined,
      })
      .pipe(tap((k) => console.log(k)));
  }

  private createApplication(
    membershipInfo: LicenseMembershipInfo
  ): Observable<number> {
    this.request.membershipNumber = membershipInfo.membershipNumber;
    this.request.membershipId = membershipInfo.membershipId;
    return this.createUser().pipe(
      switchMap((res) => {
        if (res.succeeded) {
          // return this.sendRegistration();
        }
        console.log('Email is already crewated');
        return of(false);
      }),
      switchMap(() => this.createRequestMembership()),
      tap((appId) => (this.request.applicationNumber = appId))
    );
  }

  private makeFormData(): FormData {
    const f = new FormData();
    for (const key in this.request) {
      if (key) {
        if (key === 'emiratesIDNumber' && this.openType === 'Update') {
          f.append(key, null); // this is because in License system has a check
        } else {
          f.append(key, this.request[key]);
        }
      }
    }
    return f;
  }

  private createLicensorRequest(): Observable<LicenseMembershipInfo> {
    return this.licenseAuthenticationService
      .request(
        `${environment.licenseUrl}/api/SalesPoint/AddNewMembership`,
        this.makeFormData()
      )
      .pipe();
  }

  private getIndex(value: string): number {
    return this.steps.findIndex((x) => x === value);
  }

  public previous(): void {
    const lastOne = this.previousSteps$.value.pop();
    this.currentStep$.next(lastOne);
    this.checkSubmitAllowance(lastOne);
    this.requestValidation = [];
  }

  private setCurrentStep(step: string): void {
    this.currentStep$.next(step);
    this.cacheCurrentStep(step, this.previousSteps$.value);
  }

  private cacheCurrentStep(step: string, previousSteps: string[]): void {
    if (!environment.production) {
      // localStorage.setItem(CURRENT_STEP_TOKEN, step);
      // localStorage.setItem(PREVIOUS_STEP_TOKEN, JSON.stringify(previousSteps));
    }
  }

  private cacheCurrentData(data): void {
    if (!environment.production) {
      // localStorage.setItem(CURRENT_DATA_TOKEN, JSON.stringify(data));
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
