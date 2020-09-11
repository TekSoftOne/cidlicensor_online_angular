import { BehaviorSubject, Observable, of, combineLatest, forkJoin } from 'rxjs';
import { isFormValid, isControlValid } from 'src/app/form';
import {
  IFormWizard,
  MembershipRequest,
  Location,
  Area,
  CustomValidation,
} from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { map, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'ot-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit, IFormWizard {
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  @Output() dataValidation: EventEmitter<CustomValidation> = new EventEmitter<
    CustomValidation
  >();

  @Input() locationId: number;
  @Input() areaId: number;

  public formSubmitted$: BehaviorSubject<boolean>;
  public locationSelected$: BehaviorSubject<number | undefined>;
  public areaSelected$: BehaviorSubject<number | undefined>;
  public areaSelected: Observable<number>;
  public isValid: Observable<boolean>;
  public locations$: Observable<Location[]>;
  public locations: Location[] = [];
  // public locationAll$: Observable<Location[]>;
  public areas$: Observable<Area[]>;

  constructor() {
    this.formSubmitted$ = new BehaviorSubject<boolean>(false);
    this.locationSelected$ = new BehaviorSubject<number | undefined>(undefined);
    this.areaSelected$ = new BehaviorSubject<number | undefined>(this.areaId);
    this.areaSelected = this.areaSelected$.asObservable().pipe(
      map((area) => {
        if (!area) {
          return this.areaId;
        }

        return area;
      })
    );

    const locationAll$ = of([
      {
        address: 'Shop 202 , Business Bay Branch , AE , Dubai',
        id: 1,
        areaId: 1,
      },
      { address: 'Shop 302 , Jumirah Branch , MMI , Dubai', id: 2, areaId: 1 },
      { address: 'Address 3', id: 3, areaId: 2 },
      { address: 'Address 4', id: 4, areaId: 2 },
    ]);

    locationAll$.subscribe();

    this.areas$ = of([
      { name: 'area1', id: 1 },
      { name: 'area2', id: 2 },
    ]);

    this.locations$ = combineLatest([locationAll$, this.areaSelected]).pipe(
      map(([locations, areaId]) => {
        return locations.filter((x) => x.areaId === Number(areaId));
      }),
      tap((l) => (this.locations = l))
    );

    const locationSelected = this.locationSelected$
      .asObservable()
      .pipe(tap((l) => (this.locationId = l)));

    locationSelected.subscribe();

    this.isValid = combineLatest([
      this.formSubmitted$,
      this.locationSelected$,
    ]).pipe(
      map(([submitted, id]) => {
        if (!submitted) {
          return true; // = valid
        }
        if (id === undefined) {
          return false;
        }
        return true;
      }),
      tap((s) =>
        this.dataValidation.emit({ controlName: 'Location', isValid: s })
      )
    );
  }

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    this.formSubmitted$.next(true);
    this.data.emit({
      areaId: this.areaId,
      locationId: this.locationId,
      locationAddress: this.locations.find((l) => l.id === this.locationId)
        ?.address,
    });
    this.nextStep.emit(f);
  }

  public onLocationSelect(location: number, locationName: string): void {
    this.locationSelected$.next(location);
    this.formSubmitted$.next(false);
  }

  ngOnInit(): void {}
}
