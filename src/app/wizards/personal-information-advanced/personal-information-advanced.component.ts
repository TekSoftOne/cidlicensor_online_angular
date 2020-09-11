import {
  isFormValid,
  isControlValid,
  requireFileSizeValidator,
  requireFileSizeFormValidator,
} from 'src/app/form';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { dateFormat } from 'src/app/constants';

declare var $: any;

@Component({
  selector: 'ot-personal-information-advanced',
  templateUrl: './personal-information-advanced.component.html',
  styleUrls: ['./personal-information-advanced.component.scss'],
})
export class PersonalInformationAdvancedComponent
  implements OnInit, IFormWizard, AfterViewInit {
  constructor(private datePipe: DatePipe) {}

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  @Output() dataValidation: EventEmitter<CustomValidation> = new EventEmitter<
    CustomValidation
  >();

  public formPersonal: FormGroup;
  public nationalities: Nationality[] = [
    { id: 1, name: 'Ameria' },
    { id: 2, name: 'Netherland' },
  ];

  public religions: Religion[] = [
    { id: 1, name: 'Islam' },
    { id: 2, name: 'Kristian' },
  ];

  public genders: Gender[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ];

  @Input() fileEmirateBack: File;
  @Input() fileEmirateFront: File;
  @Input() fileAuthorizationLetter: File;
  @Input() fileProfilePic: File;

  @Input() emirateIdNumber: string;
  @Input() passportNumber: string;
  @Input() birthday: string;
  @Input() genderId: number;
  @Input() religionId: number;

  @Input() nationId: number;

  // disable hide event of datepicker when focus to the textbox
  public isHideEnable = false;

  @ViewChild('birthdayDatePicker', { static: true })
  birthdayDatePicker: ElementRef;

  ngAfterViewInit(): void {
    this.initDatePicker();
  }

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  public test(e: Event): void {
    console.log();
  }
  next(f: NgForm): void {
    this.data.emit({
      nationId: this.nationId,
      emirateBackAttach: this.fileEmirateBack,
      emirateFrontAttach: this.fileEmirateFront,
      profilePicAttach: this.fileProfilePic,
      authorizationLetterAttach: this.fileAuthorizationLetter,
      genderId: this.genderId,
      emirateIdNumber: this.emirateIdNumber,
      passportNumber: this.passportNumber,
      birthday: this.birthday,
      religionId: this.religionId,
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    this.formPersonal = new FormGroup({
      nation: new FormControl(0, [Validators.required, Validators.min(1)]),
      religion: new FormControl(0, [Validators.required, Validators.min(1)]),
      birthday: new FormControl('', Validators.required),
      emirateIdNumber: new FormControl('', Validators.required),
      passportNumber: new FormControl('', Validators.required),
      genderId: new FormControl(0, Validators.min(1)),
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
      .on('show', (e) => {
        this.isHideEnable = true;
      });
  }
}
