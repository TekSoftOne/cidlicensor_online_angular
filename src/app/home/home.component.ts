import { AuthenticationService } from './../authentication/authentication.service';
import { LoginComponent } from './../authentication/login/login.component';
import { StateService } from './../state-service';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { environment } from 'src/environments/environment';
import {
  CURRENT_DATA_TOKEN,
  CURRENT_STEP_TOKEN,
  PREVIOUS_STEP_TOKEN,
  showHomeScreens,
} from './../constants';
import {
  MembershipRequest,
  CustomValidation,
  CreateUserResult,
} from './../interfaces';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { createRandomPass } from '../authentication/password-generator';
import {
  stepsAll,
  showPreviousButtonScreens,
  showNextButtonScreens,
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
  public applicationNumber$: BehaviorSubject<string>;
  public applicationNumber: Observable<string>;
  public error: string;
  public steps: string[] = [];
  constructor(
    private httpClient: HttpClient,
    private toastrservice: ToastrService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    private stateService: StateService,
    private authenticationService: AuthenticationService
  ) {
    this.steps = stepsAll.filter((s) => {
      if (
        this.authenticationService.loginSilently() &&
        (s === 'sPhoneNumber' || s === 'sVerifyPhone')
      ) {
        return false;
      }

      return true;
    });

    this.currentStep$ = new BehaviorSubject<string>(this.loadCurrentStep());
    this.previousSteps$ = new BehaviorSubject<string[]>(
      this.loadPreviousSteps()
    );
    this.applicationNumber$ = new BehaviorSubject<string>(
      this.stateService.data.request?.applicationNumber
    );

    this.applicationNumber = this.applicationNumber$.asObservable().pipe(
      tap((application) => {
        if (application) {
          this.request = this.stateService.data.request;
        }
      })
    );

    this.isNextButtonShowed = this.currentStep$.pipe(
      map((s) => showNextButtonScreens.includes(s))
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
    genderId: 0,
    areaId: '0',
    membershipNumber: '0',
  };

  public requestValidation: CustomValidation[] = [];

  public updateData(request: MembershipRequest): void {
    this.request = { ...this.request, ...request };
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

  public next(f: NgForm): void {
    if (
      !f.form.valid ||
      this.requestValidation.filter((x) => !x.isValid).length > 0
    ) {
      console.log('invalid');
      return;
    }
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

      this.processApplication().subscribe();
    } else if (this.currentStep$.value === 'sSearch') {
      this.processSearch();
      return;
    } else if (
      this.currentStep$.value === 'sTypeOfCustomer' &&
      this.request.typeOfCustomer === 'Tourist'
    ) {
      this.request.requestCategory = 'New';
      step = this.steps[index + 3]; // tourist only have New, not Replacement or Renew
    }

    const previousSteps = this.previousSteps$.value;
    previousSteps.push(this.currentStep$.value);

    this.previousSteps$.next(previousSteps);
    this.currentStep$.next(step);
    this.cacheCurrentStep(step, this.previousSteps$.value);
    this.requestValidation = [];
  }

  private processApplication(): Observable<string | undefined> {
    return this.createApplication().pipe(
      map((appResult) => {
        this.applicationNumber$.next(appResult);
      }),
      switchMap(() => this.createLicensorRequest()),
      tap(() => this.licenseAuthenticationService.removeAccessCache()),

      catchError((err) => {
        err.error
          ? this.toastrservice.error(err.error)
          : this.toastrservice.error(err);
        return of(undefined);
      })
    );
  }

  private processSearch(): void {
    this.toastrservice.error(
      'Can not find this membership, please try another one!'
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

  private createRequestMembership(): Observable<string> {
    return this.httpClient
      .post(
        `${environment.apiUrl}/api/membershipRequests/update`,
        this.makeFormData()
      )
      .pipe(map((appId) => appId as string));
  }

  private sendRegistration(password: string): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/Users/SendRegisterInformation`, {
        userName: this.request.email,
        email: this.request.email,
        fullName: this.request.fullName,
        password: btoa(password),
      })
      .pipe(tap((k) => console.log(k)));
  }

  private createApplication(): Observable<string> {
    return this.createUser().pipe(
      switchMap((res) => {
        if (res.succeeded) {
          return this.sendRegistration(res.password);
        }
        console.log('Email is already crewated');
        return of(false);
      }),
      switchMap(() => this.createRequestMembership()),
      catchError((err) => {
        this.toastrservice.error(err);
        return of(undefined);
      })
    );
  }

  private makeFormData(): FormData {
    const f = new FormData();
    for (const key in this.request) {
      if (key) {
        f.append(key, this.request[key]);
      }
    }
    return f;
  }

  private createLicensorRequest(): Observable<string> {
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
