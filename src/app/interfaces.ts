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
  nationName?: string;
  emirateBackAttach?: File;
  emirateFrontAttach?: File;
  profilePicAttach?: File;
  authorizationLetterAttach?: File;
  typeOfCustomer?: any;
  typeOfRequest?: any;
  membershipNumber?: string;
  emirateIdNumber?: string;
  passportNumber?: string;
  genderId?: number;
  genderName?: string;
  birthday?: string;
  religionId?: number;
  religionName?: string;
  // step
  monthlySalary?: number;
  monthlyQuota?: number;
  comment?: string;
  // step
  areaId?: number;
  locationId?: number;
  locationAddress?: string;
}

export interface Religion {
  name: string;
  id: number;
}

export interface Gender {
  name: string;
  id: number;
}

export interface CustomValidation {
  controlName: string;
  isValid: boolean;
}

export interface Area {
  name: string;
  id: number;
}

export interface Location {
  address: string;
  id: number;
  areaId: number;
}

export interface CustomerType {
  name: string;
  id: number;
}
