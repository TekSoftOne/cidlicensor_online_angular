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
  membershipRequestId?: number;
  phoneNumber?: string;
  verifyNumber?: string;
  fullName?: string;
  email?: string;
  address?: string;
  fullAddress?: string;
  nationId?: number;
  nationName?: string;
  emiratesIdBack?: File;
  emiratesIdFront?: File;
  passportAttachement?: File;
  profilePhoto?: File;
  authorizationLetter?: File;
  typeOfCustomer?: any; // membership type
  membershipTypeId?: number;
  requestCategory?: any;
  membershipNumber?: string;
  emiratesIDNumber?: string;
  passportNumber?: string;
  genderId?: number;
  genderName?: string;
  birthdate?: string;
  religionId?: number;
  religionName?: string;
  // step
  monthlySalary?: number;
  monthlyQuota?: number;
  comment?: string;
  // step
  areaId?: number;
  locationId?: number;
  occupation?: string;
  visaResidency?: number;
  locationAddress?: string;
  agentId?: string;
  randomPass?: string;
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
  salepointUser: string;
}

export interface CustomerType {
  name: string;
  id: number;
}

export interface CreateUserResult {
  succeeded: boolean;
  errors: CreateUserError[];
  password: string;
}

export interface CreateUserError {
  code: string;
  description: string;
}

export interface VerificationModel {
  phoneNumber: string;
  code: string;
}

export interface VerificationSendResult {
  isValid: boolean;
  errors: any;
}

export interface VerificationCheckCodeResult {
  isValid: boolean;
  errors: any;
}
