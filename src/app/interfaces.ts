import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { InjectionToken } from '@angular/core';
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

export const WINDOW = new InjectionToken<Window>('window', {
  factory: () => window,
  providedIn: 'root',
});

export interface MembershipRequest {
  loggedIn?: boolean;
  applicationNumber?: number;
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
  profilePic?: string; // needed this for Licensor system
  authorizationLetter?: File;
  typeOfCustomer?: string; // membership type
  membershipTypeId?: number;
  requestCategory?: string;
  membershipNumber?: string;
  emiratesIDNumber?: string;
  passportNumber?: string;
  gender?: number;
  genderName?: string;
  birthDate?: string;
  religionId?: number;
  religionName?: string;
  // step
  monthlySalary?: number;
  monthlyQuota?: number;
  monthlyQuotaName?: string;
  monthlySalaryName?: string;
  comment?: string;
  // step
  areaId?: string;
  locationId?: number;
  visaResidency?: number;
  locationAddress?: string;
  agentId?: string;
  randomPass?: string;
  membershipRequestType?: number;
  membershipId?: number;
  status?: number;
  orderRef?: string;
  paymentType?: string;
}

export interface HttpRequestOptions {
  headers?: HttpHeaders;
}

export interface MembershipRequestResult extends MembershipRequest {
  profilePic?: string;
  emiratesIdBackUrl?: string;
  emiratesIdFrontUrl?: string;
  authorizationLetterUrl?: string;
  passportAttachementUrl?: string;
}

export interface LicenseMembershipInfo {
  membershipId: number;
  membershipNumber: string;
}

export interface ApplicationState {
  request?: MembershipRequestResult;
  currentOrderRef?: string;
  currentOrderGUID?: string;
  openType: string;
  currentStep: string;
}

export interface Religion {
  name: string;
  id: number;
}

export interface Gender {
  name: string;
  id: number;
}

export interface Salary {
  name: string;
  id: number;
}

export interface Quota {
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
  areaId: string;
  salepointUser: string;
  agentId: number;
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

export interface PaymentInfoLicensor {
  membershipId: number;
  membershipNumber: string;
  paymentType: number;
  requestCategory: number;
  orderRefNumber: string;
  amount: number;
}
