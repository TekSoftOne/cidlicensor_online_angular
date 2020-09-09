import {
  isFormValid,
  isControlValid,
  requireCheckboxesToBeCheckedValidator,
} from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ot-type-of-request',
  templateUrl: './type-of-request.component.html',
  styleUrls: ['./type-of-request.component.scss'],
})
export class TypeOfRequestComponent implements OnInit, IFormWizard {
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  public formRequestType: FormGroup;

  @Input() typeOfRequest: any;
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    this.data.emit({ typeOfRequest: this.typeOfRequest });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    this.formRequestType = new FormGroup({
      cbGroupRequestType: new FormGroup(
        {
          typeOfRequest: new FormControl(false),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
    });
  }
}
