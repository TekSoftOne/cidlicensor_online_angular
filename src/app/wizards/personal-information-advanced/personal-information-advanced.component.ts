import { ToastrService } from 'ngx-toastr';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { StateService } from './../../state-service';
import { UploadFileComponent } from './../../upload-file/upload-file.component';
import { nationalities, religions } from './../../constants';
import { isFormValid, isControlValid } from 'src/app/form';
import {
  IFormWizard,
  Religion,
  Gender,
  CustomValidation,
} from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { MembershipRequest, Nationality } from 'src/app/interfaces';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { dateFormat } from 'src/app/constants';
import { environment } from 'src/environments/environment';
import { UploadImageComponent } from 'src/app/upload-image/upload-image.component';

declare var $: any;

@Component({
  selector: 'ot-personal-information-advanced',
  templateUrl: './personal-information-advanced.component.html',
  styleUrls: ['./personal-information-advanced.component.scss'],
})
export class PersonalInformationAdvancedComponent
  implements OnInit, IFormWizard, AfterViewInit, OnChanges {
  public emirateIdNumberExisting$: Observable<boolean>;
  public checkingEmirateIdNumber = false;
  @Output() disableNext: EventEmitter<boolean>;

  constructor(
    private datePipe: DatePipe,
    public stateService: StateService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    private toastrService: ToastrService
  ) {
    this.emirateIdChanged$ = new BehaviorSubject<string>(this.emirateIDNumber);
    this.disableNext = new EventEmitter<boolean>();
    this.emirateIdNumberExisting$ = this.emirateIdChanged$.pipe(
      switchMap((id) => {
        if (
          !this.stateService.state.request.applicationNumber ||
          this.stateService.state.request.applicationNumber <= 0
        ) {
          if (this.emirateIDNumber && this.emirateIDNumber.length > 0) {
            this.checkingEmirateIdNumber = true;
            this.disableNext.emit(true);
            return this.licenseAuthenticationService.get(
              `${environment.licenseUrl}/api/common/EmiratesIDExisting?emiratesID=${id}`
            );
          }

          return of(false);
        }
      }),

      tap((isExisting) => {
        this.emirateIdExising = isExisting;
        this.checkingEmirateIdNumber = false;
        this.disableNext.emit(false);
      }),
      catchError((err) => {
        this.checkingEmirateIdNumber = false;
        this.disableNext.emit(false);
        console.log(err);
        return undefined;
      })
    );

    this.genders$ = of([
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
    ]).pipe(tap((g) => (this.genders = g)));

    this.nationalities$ = of(nationalities).pipe(
      tap((n) => (this.nationalities = n))
    );

    this.religions$ = of(religions).pipe(tap((r) => (this.religions = r)));
  }

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  @Output() dataValidation: EventEmitter<CustomValidation> = new EventEmitter<
    CustomValidation
  >();

  @Input() enabled: boolean;

  public formPersonal: FormGroup;
  public nationalities$: Observable<Nationality[]>;

  public religions$: Observable<Religion[]>;

  public genders$: Observable<Gender[]>;

  public genders: Gender[] = [];
  public nationalities: Nationality[] = [];
  public religions: Religion[] = [];

  @Input() fileEmirateBack: File;
  @Input() emirateBackUrl: string;
  @Input() fileEmirateFront: File;
  @Input() fileAuthorizationLetter: File;
  @Input() fileProfilePic: File;

  @Input() emirateIDNumber: string;
  @Input() passportNumber: string;
  @Input() birthday: string;
  @Input() gender: number;
  @Input() religionId: number;

  public emirateIdExising = false;
  public emirateIdChanged$: BehaviorSubject<string>;

  @Input() nationId: number;
  @Input() typeOfCustomer: string;
  // disable hide event of datepicker when focus to the textbox
  public isHideEnable = false;

  @ViewChild('birthdayDatePicker', { static: true })
  birthdayDatePicker: ElementRef;

  @ViewChild('uploadProfileControl', { static: true })
  uploadProfileImage: UploadImageComponent;

  @ViewChild('uploadPassportControl', { static: true })
  uploadPassportFile: UploadFileComponent;

  ngAfterViewInit(): void {
    this.initDatePicker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.birthday) {
      this.birthday = this.datePipe.transform(
        changes.birthday.currentValue,
        dateFormat
      );
    }

    if (changes.emirateIDNumber) {
      this.emirateIdChanged$.next(changes.emirateIDNumber.currentValue);
    }
  }

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }

  public emirateIdNumberChanged(): void {
    this.emirateIdChanged$.next(this.emirateIDNumber);
  }

  next(f: NgForm): void {
    if (environment.enableValidation) {
      if (
        !f.valid ||
        !this.uploadProfileImage.isControlValid() ||
        !this.uploadPassportFile.isControlValid()
      ) {
        return;
      }
    }

    if (this.emirateIdExising) {
      this.toastrService.error('Emirate ID Number is already existed');
      return;
    }

    this.data.emit({
      nationId: this.nationId,
      nationName: this.nationalities.find((x) => x.id === Number(this.nationId))
        ?.name,
      emiratesIdBack: this.fileEmirateBack,
      emiratesIdFront: this.fileEmirateFront,
      profilePhoto: this.fileProfilePic,
      authorizationLetter: this.fileAuthorizationLetter,
      gender: this.gender,
      genderName: this.genders.find((x) => x.id === Number(this.gender))?.name,
      emiratesIDNumber: this.emirateIDNumber,
      passportNumber: this.passportNumber,
      birthDate: this.birthday,
      religionId: this.religionId,
      religionName: this.religions.find((r) => r.id === Number(this.religionId))
        ?.name,
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    const passportRequirements =
      this.typeOfCustomer === 'tourist' ? [Validators.required] : [];
    this.formPersonal = new FormGroup({
      nation: new FormControl(0, [Validators.required, Validators.min(1)]),
      religion: new FormControl(0, [Validators.required, Validators.min(1)]),
      birthday: new FormControl('', Validators.required),
      emirateIDNumber: new FormControl('', Validators.required),
      passportNumber: new FormControl('', passportRequirements),
      gender: new FormControl(0, Validators.min(1)),
    });
  }

  private initDatePicker(): void {
    $('#datepickertwo')
      .datepicker({ autoclose: true })
      // fix issue with validation: closing dialog, has value, still not valid
      .on('hide', (e) => {
        if (this.isHideEnable) {
          this.birthday = this.datePipe.transform(e.date, dateFormat);
        }

        this.isHideEnable = false;
      })
      .on('show', () => {
        this.isHideEnable = true;
      });
  }
}
