import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
export interface IFormWizard {
  nextStep: EventEmitter<NgForm>;
  data: EventEmitter<MembershipRequest>;
  checkFormInvalid(form: NgForm): boolean;
  checkControlInvalid(form: NgForm, control: any): boolean;
  next(f: NgForm): void;
}

export interface Nationality {
  name: string;
  id: number;
}

export interface MembershipRequest {
  phoneNumber?: string;
  verifyNumber?: string;
  fullName?: string;
  emailAddress?: string;
  address?: string;
  fullAddress?: string;
  nationId?: number;
  emirateBackAttach?: File;
  typeOfCustomer?: any;
  typeOfRequest?: any;
  membershipNumber?: string;
}
