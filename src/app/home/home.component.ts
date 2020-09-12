import { showHomeScreens } from './../constants';
import {
  Nationality,
  MembershipRequest,
  CustomValidation,
} from './../interfaces';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, pipe, of } from 'rxjs';
import { map, tap, switchMap, switchMapTo, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormControl, Validators, Form } from '@angular/forms';

import {
  steps,
  showPreviousButtonScreens,
  showNextButtonScreens,
  showStepsFlowScreens,
} from '../constants';

import { FormGroup, ValidatorFn } from '@angular/forms';
import { requireCheckboxesToBeCheckedValidator } from '../form';
import { AuthenticationService } from '../authentication/authentication.service';

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
  constructor(private httpClient: HttpClient) {
    this.currentStep$ = new BehaviorSubject<string>(this.loadCurrentStep());

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

    this.isSearchStep = this.currentStep$.pipe(map((s) => s === 'serDiv1'));
  }
  options = {
    center: { lat: 40, lng: -20 },
    zoom: 4,
  };

  public isNextButtonShowed: Observable<boolean>;
  public isPreviousButtonShowed: Observable<boolean>;
  public isStepsFlowShowed: Observable<boolean>;
  public isHomeShowed: Observable<boolean>;
  public isSearchStep: Observable<boolean>;

  private readonly defaultStep = 'sPhoneNumber';
  public currentStep$: BehaviorSubject<string>;
  public isMobileSend = false;
  public googleApiLoad: any;

  public request: MembershipRequest = {
    // address: 'sdfdfsdf',
    // emailAddress: 'sdfsdf@sdfsdf',
    // emirateBackAttach: undefined,
    // fullAddress: 'sdfsdfsdf',
    // fullName: 'sdfsdf',
    // membershipNumber: 'membership12343',
    // phoneNumber: '+131231231',
    // typeOfCustomer: 'diplomat',
    // typeOfRequest: 'replacement',
    // verifyNumber: '123456',
    nationId: 0,
    religionId: 0,
    genderId: 0,
    areaId: 1,
    // locationId: 1,
  };

  public requestValidation: CustomValidation[] = [];

  private readonly CURRENT_STEP_TOKEN = 'OT_STEP';
  private readonly CURRENT_DATA_TOKEN = 'OT_D';

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
    const cacheStep = localStorage.getItem(this.CURRENT_STEP_TOKEN);
    if (cacheStep) {
      return cacheStep;
    }

    return this.defaultStep;
  }

  public loadCurrentData(): MembershipRequest {
    const cacheData = localStorage.getItem(this.CURRENT_DATA_TOKEN);
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
    // if (
    //   !f.form.valid ||
    //   this.requestValidation.filter((x) => !x.isValid).length > 0
    // ) {
    //   console.log('invalid');
    //   return;
    // }
    const index = this.getIndex(this.currentStep$.value);
    let step = steps[index + 1];
    if (this.request.typeOfRequest === 'new') {
      step = steps[index + 2];
    }
    this.currentStep$.next(step);
    this.cacheCurrentStep(step);
    this.cacheCurrentData(this.request);
    this.requestValidation = [];
  }

  private getIndex(value: string): number {
    return steps.findIndex((x) => x === value);
  }

  public previous(): void {
    const index = this.getIndex(this.currentStep$.value);

    let step = steps[index - 1];
    if (step === 'serDiv1') {
      step = steps[index - 2];
    }
    this.currentStep$.next(step);
    this.requestValidation = [];
  }

  private setCurrentStep(step: string): void {
    this.currentStep$.next(step);
    this.cacheCurrentStep(step);
  }

  private cacheCurrentStep(step: string): void {
    localStorage.setItem(this.CURRENT_STEP_TOKEN, step);
  }

  private cacheCurrentData(data: MembershipRequest): void {
    localStorage.setItem(this.CURRENT_DATA_TOKEN, JSON.stringify(data));
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
