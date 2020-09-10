import {
  isFormValid,
  isControlValid,
  requireFileSizeValidator,
  requireFileSizeFormValidator,
} from 'src/app/form';
import { IFormWizard, Religion, Gender } from './../../interfaces';
import * as datePickerHelper from './date-picker-helper.js';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  AfterViewInit,
  Input,
} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { MembershipRequest, Nationality } from 'src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ot-personal-information-advanced',
  templateUrl: './personal-information-advanced.component.html',
  styleUrls: ['./personal-information-advanced.component.scss'],
})
export class PersonalInformationAdvancedComponent
  implements OnInit, IFormWizard, AfterViewInit {
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
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

  ngAfterViewInit(): void {
    datePickerHelper();
  }

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
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
}
