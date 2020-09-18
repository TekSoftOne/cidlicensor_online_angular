import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, combineLatest, forkJoin } from 'rxjs';
import { isFormValid, isControlValid } from 'src/app/form';
import {
  IFormWizard,
  MembershipRequest,
  Location,
  Area,
  CustomValidation,
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
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { map, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'ot-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit, IFormWizard, OnChanges {
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  @Output() dataValidation: EventEmitter<CustomValidation> = new EventEmitter<
    CustomValidation
  >();

  @Input() locationId: number;
  @Input() areaId: string;

  public formSubmitted$: BehaviorSubject<boolean>;
  public locationSelected$: BehaviorSubject<number | undefined>;
  public areaSelected$: BehaviorSubject<string | undefined>;
  public areaSelected: Observable<string>;
  public isValid: Observable<boolean>;
  public locations$: Observable<Location[]>;
  public locations: Location[] = [];
  // public locationAll$: Observable<Location[]>;
  public areas$: Observable<Area[]>;

  constructor(private httpClient: HttpClient) {
    this.formSubmitted$ = new BehaviorSubject<boolean>(false);
    this.locationSelected$ = new BehaviorSubject<number | undefined>(
      this.locationId
    );
    this.areaSelected$ = new BehaviorSubject<string | undefined>(this.areaId);
    this.areaSelected = this.areaSelected$.asObservable().pipe(
      map((area) => {
        if (!area) {
          return this.areaId;
        }

        return area;
      })
    );

    const locationAll$ = this.httpClient
      .get(`${environment.licenseUrl}/api/ManageAreas/GetLocations`)
      .pipe(
        map((data: any) =>
          data.map((d) => ({
            id: d.locationId,
            address: d.name,
            areaId: d.areaId,
            agentId: d.agentId,
          }))
        ),
        tap((d) => console.log(d))
      );

    this.areas$ = this.httpClient
      .get(`${environment.licenseUrl}/api/ManageAreas/GetAreas`)
      .pipe(
        map((data: any) =>
          data.map((d) => ({
            id: d.areaId,
            name: d.areaName,
          }))
        ),
        tap((d) => console.log(d))
      );

    this.locations$ = combineLatest([locationAll$, this.areaSelected]).pipe(
      map(([locations, areaId]) => {
        return locations.filter((x) => x.areaId === areaId);
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.locationId) {
      this.locationSelected$.next(changes.locationId.currentValue);
    }
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

  public onLocationSelect(location: number, agentId: string): void {
    this.locationSelected$.next(location);
    this.data.emit({ agentId });
    this.formSubmitted$.next(false);
  }

  ngOnInit(): void {}
}
