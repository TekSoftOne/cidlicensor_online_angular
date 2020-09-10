import { isFormValid, isControlValid } from 'src/app/form';
import { IFormWizard, Religion } from './../../interfaces';
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
    { id: 1, name: 'Kristian' },
  ];

  public fileEmirateBack: File;

  @Input() nationId: number;

  ngAfterViewInit(): void {
    datePickerHelper();
  }

  public onFileChange(files: FileList): void {
    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
    this.fileEmirateBack = files.item(0);
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
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    this.formPersonal = new FormGroup({
      nation: new FormControl(0, [Validators.required, Validators.min(1)]),
      emirateBackAttach: new FormControl('', Validators.required),
    });
  }
}
