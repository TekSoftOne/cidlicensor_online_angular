import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MembershipRequest } from './constants';
export interface IFormWizard {
  nextStep: EventEmitter<NgForm>;
  data: EventEmitter<MembershipRequest>;
  checkFormInvalid(form: NgForm): boolean;
  checkControlInvalid(form: NgForm, control: any): boolean;
  next(f: NgForm): void;
}
