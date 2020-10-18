import { environment } from 'src/environments/environment';
import {
  isFormValid,
  isControlValid,
  createGoogleMapsScript,
} from 'src/app/form';
import { IFormWizard } from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  AfterViewInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MembershipRequest } from 'src/app/interfaces';
import * as scripts from './google-map-helper.js';

@Component({
  selector: 'ot-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent
  implements OnInit, AfterViewInit, IFormWizard {
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() fullName: string;
  @Input() email: string;
  @Input() address: string;
  @Input() fullAddress: string;
  @Input() enabled: boolean;
  ngAfterViewInit(): void {
    try {
      scripts();
    } catch (e) {
      console.warn(e);
    }
    setTimeout(createGoogleMapsScript);
  }

  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  next(f: NgForm): void {
    this.data.emit({
      fullName: this.fullName,
      email: this.email,
      address: this.address,
      fullAddress: this.fullAddress,
    });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {}
}
