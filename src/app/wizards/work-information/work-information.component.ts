import { isFormValid, isControlValid } from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ot-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss'],
})
export class WorkInformationComponent implements OnInit, IFormWizard {
  constructor() {}
  nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  data: EventEmitter<MembershipRequest> = new EventEmitter<MembershipRequest>();
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    this.data.emit({});
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
