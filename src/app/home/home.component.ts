import { showHomeScreens } from './../constants';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, pipe, of } from 'rxjs';
import { map, tap, switchMap, switchMapTo, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormControl } from '@angular/forms';
import {
  steps,
  showPreviousButtonScreens,
  showNextButtonScreens,
  showStepsFlowScreens,
} from '../constants';

import { FormGroup, ValidatorFn } from '@angular/forms';

export function requireCheckboxesToBeCheckedValidator(
  minRequired = 1
): ValidatorFn {
  // tslint:disable-next-line: typedef
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];

      if (control.value !== false) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'ot-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  options = {
    center: { lat: 40, lng: -20 },
    zoom: 4,
  };

  @ViewChild('membershipForm', { static: true }) membershipForm: ElementRef;

  public isNextButtonShowed: Observable<boolean>;
  public isPreviousButtonShowed: Observable<boolean>;
  public isStepsFlowShowed: Observable<boolean>;
  public isHomeShowed: Observable<boolean>;
  private language = 'en';

  public currentStep$ = new BehaviorSubject<string>('mainDiv');
  public isMobileSend = false;
  public googleApiLoad: any;

  public formCustomerType = new FormGroup({
    // ...more form controls...
    cbGroupCustomerType: new FormGroup(
      {
        typeOfCustomer: new FormControl(false),
      },
      requireCheckboxesToBeCheckedValidator()
    ),
    // ...more form controls...
  });

  public formRequestType = new FormGroup({
    // ...more form controls...
    cbGroupRequestType: new FormGroup(
      {
        typeOfRequest: new FormControl(false),
      },
      requireCheckboxesToBeCheckedValidator()
    ),
    // ...more form controls...
  });

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
  }

  public searchRequest(): void {
    this.setCurrentStep('ftDiv3');
  }

  public sendMobile(): void {
    this.isMobileSend = true;
  }

  public isFormValid(form: NgForm): boolean {
    return form.invalid && (form.dirty || form.touched || form.submitted);
  }

  public next(f: NgForm): void {
    if (!f.form.valid) {
      console.log('invalid');
      return;
    }
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

  ngAfterViewInit(): void {
    this.googleApiLoad = this.httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBgSPoq80yJ1txKlNgTgIAxvsBKTOaUGIY',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
}
