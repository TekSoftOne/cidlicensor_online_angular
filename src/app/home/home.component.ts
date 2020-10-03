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
} from './../constants';
import {
  MembershipRequest,
  CustomValidation,
  CreateUserResult,
  LicenseMembershipInfo,
  MembershipRequestResult,
} from './../interfaces';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { catchError, last, map, switchMap, tap } from 'rxjs/operators';
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
import { Router, RouterStateSnapshot } from '@angular/router';

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

  public nextButtonsOnScreens: string[] = [];
  constructor(
    private httpClient: HttpClient,
    private toastrservice: ToastrService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    public stateService: StateService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    const state: RouterStateSnapshot = router.routerState.snapshot;
    if (state.url.indexOf('?ref=') > 0) {
      const orderRef = state.url.replace('/?ref=', '');
      const url = `/checkout?orderRef=${orderRef}`;
      this.router.navigateByUrl(url);
    }

    this.steps = this.stateService.getSteps(this.request);

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
          (!this.request.applicationNumber ||
            this.request.applicationNumber < 0) &&
          this.stateService.data.request
        ) {
          this.request = {
            ...this.stateService.data.request,
            membershipRequestType: 2, // always = 2 whatever,
          };
          this.openType = 'Update';
        }
      }),
      tap(() => this.isApprovedRequest$.next(this.isApproved()))
    );

    this.isNextButtonShowed = this.currentStep.pipe(
      map((s) => this.nextButtonsOnScreens.includes(s))
    );

    this.isPreviousButtonShowed = this.currentStep.pipe(
      map((s) => showPreviousButtonScreens.includes(s))
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

  public request: MembershipRequestResult = {
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

  public updateData(request: MembershipRequestResult): void {
    this.request = { ...this.request, ...request };
  }

  public updateSearchMembershipData(request: MembershipRequestResult): void {
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

    if (!this.request.phoneNumber) {
      // user get to home page from last session
      this.request.phoneNumber = this.authenticationService.getUser().email;
    }

    if (this.stateService.currentStep$.value === 'sReview') {
      if (
        !this.request.email ||
        !this.request.fullName ||
        !this.request.phoneNumber
      ) {
        this.toastrservice.error('Email and PhoneNumber is required');
        return;
      }

      this.updateStatus = this.processApplication();
    }

    if (step === 'sSearch' && this.request.requestCategory === 'New') {
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
    this.request.membershipNumber = membershipInfo.membershipNumber;
    this.request.membershipId = membershipInfo.membershipId;
    return this.createRequestMembership().pipe(
      tap((appId) => (this.request.applicationNumber = appId))
    );
  }

  private makeFormData(): Observable<FormData> {
    return toBase64FromFile(this.request.profilePhoto).pipe(
      map((photo) => {
        const f = new FormData();
        for (const key in this.request) {
          if (key) {
            // alway change status to pendind whenever updating
            if (key === 'status') {
              f.append(
                key,
                statuses.find((s) => s.name === 'Pending')?.id.toString()
              );
            } else {
              f.append(key, this.request[key]);
            }

            // Occupation = FullAddress
            if (key === 'fullAddress') {
              f.append('occupation', this.request[key]);
            }

            if (key === 'profilePhoto') {
              // file to string
              f.append('profilePic', photo); // string
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
