import { BehaviorSubject, Observable, of } from 'rxjs';
import { isFormValid, isControlValid } from 'src/app/form';
import {
  IFormWizard,
  MembershipRequest,
  Salary,
  Quota,
} from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { monthlyQuotaRanges, monthlySalaryRanges } from 'src/app/constants';

@Component({
  selector: 'ot-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss'],
})
export class WorkInformationComponent implements OnInit, IFormWizard {
  public monthlySalaries: Observable<Salary[]>;
  public monthlyQuotas: Observable<Quota[]>;

  constructor() {
    this.monthlyQuotas = of(monthlyQuotaRanges);
    this.monthlySalaries = of(monthlySalaryRanges);
  }
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() monthlySalary: number;
  @Input() monthlyQuota: number;
  @Input() comment: string;
  @Input() enabled: boolean;

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
      monthlyQuotaName: monthlyQuotaRanges.find(
        (x) => x.id === Number(this.monthlyQuota)
      )?.name,
      monthlySalaryName: monthlySalaryRanges.find(
        (x) => x.id === Number(this.monthlySalary)
      )?.name,
      comment: this.comment,
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
