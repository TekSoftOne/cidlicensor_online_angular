import { showHomeScreens } from './../constants';
import { Nationality, MembershipRequest } from './../interfaces';
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

@Component({
  selector: 'ot-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    private translate: TranslateService,
    private httpClient: HttpClient
  ) {
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
  private language = 'en';

  public currentStep$ = new BehaviorSubject<string>('mainDiv');
  public isMobileSend = false;
  public googleApiLoad: any;

  public request: MembershipRequest = {
    address: 'sdfdfsdf',
    emailAddress: 'sdfsdf@sdfsdf',
    fullAddress: 'sdfsdfsdf',
    fullName: 'sdfsdf',
    nationId: 0,
    phoneNumber: '+131231231',
    verifyNumber: '123456',
  };

  public updateData(request: MembershipRequest): void {
    this.request = { ...this.request, ...request };
  }

  public searchRequest(f: NgForm): void {
    if (!f.form.valid) {
      return;
    }
    this.setCurrentStep('ftDiv3');
  }

  public sendMobile(): void {
    this.isMobileSend = true;
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
    // if (!f.form.valid) {
    //   console.log('invalid');
    //   return;
    // }
    const index = this.getIndex(this.currentStep$.value);
    this.currentStep$.next(steps[index + 1]);
  }

  private getIndex(value: string): number {
    return steps.findIndex((x) => x === value);
  }

  public previous(): void {
    const index = this.getIndex(this.currentStep$.value);
    this.currentStep$.next(steps[index - 1]);
  }

  private setCurrentStep(step: string): void {
    this.currentStep$.next(step);
  }

  public changeLanguage(e: Event): void {
    e.preventDefault();
    this.setLanguage();
    this.translate.use(this.language);
  }

  private setLanguage(): void {
    if (this.language === 'en') {
      this.language = 'ar';
    } else {
      this.language = 'en';
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
