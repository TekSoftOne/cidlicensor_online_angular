import { MembershipRequest, IFormWizard } from './../../interfaces';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ot-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, IFormWizard {
  @Input() request: MembershipRequest;
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();
  checkFormInvalid(form: NgForm): boolean {
    return false;
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return false;
  }
  next(f: NgForm): void {
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
