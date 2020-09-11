import { isFormValid, isControlValid } from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ot-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss'],
})
export class WorkInformationComponent implements OnInit, IFormWizard {
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() monthlySalary: number;
  @Input() monthlyQuota: number;
  @Input() comment: string;

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    this.data.emit({
      monthlyQuota: this.monthlyQuota,
      monthlySalary: this.monthlySalary,
      comment: this.comment,
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
