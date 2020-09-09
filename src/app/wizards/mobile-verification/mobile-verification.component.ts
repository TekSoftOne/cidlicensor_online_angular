import { IFormWizard } from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isFormValid } from 'src/app/form';
import { MembershipRequest } from 'src/app/constants';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'ot-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss'],
})
export class MobileVerificationComponent implements OnInit, IFormWizard {
  constructor() {}
  @Input() verifyNumber: string;
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  checkControlInvalid(form: NgForm, control: any): boolean {
    throw new Error('Method not implemented.');
  }
  next(f: NgForm): void {
    this.data.emit({ verifyNumber: this.verifyNumber });
    this.nextStep.emit(f);
  }
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }

  ngOnInit(): void {}
}
