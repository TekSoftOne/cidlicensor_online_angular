import { IFormWizard } from './../../interfaces';
import { MembershipRequest } from './../../interfaces';
import { NgForm } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { isFormValid } from '../../form';
import * as nationPickerHelper from './nation-picker-helper.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ot-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
})
export class MobileComponent implements OnInit, AfterViewInit, IFormWizard {
  @Input() phoneNumber: string;
  @Output() nextStep = new EventEmitter<NgForm>();
  @Output() data = new EventEmitter<MembershipRequest>();
  constructor(private toastrservice: ToastrService) {}
  ngAfterViewInit(): void {
    nationPickerHelper();
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}

  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }

  public next(f: NgForm): void {
    if (!f.valid) {
      this.toastrservice.error('Please enter at least 8 numbers');
    }
    this.data.emit({ phoneNumber: this.phoneNumber } as MembershipRequest);
    this.nextStep.emit(f);
  }
}
