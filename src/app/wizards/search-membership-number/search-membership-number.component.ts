import { isFormValid, isControlValid } from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'ot-search-membership-number',
  templateUrl: './search-membership-number.component.html',
  styleUrls: ['./search-membership-number.component.scss'],
})
export class SearchMembershipNumberComponent implements OnInit, IFormWizard {
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  public membershipNumber: string;
  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  public checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  public next(f: NgForm): void {
    this.data.emit({ membershipNumber: this.membershipNumber });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
