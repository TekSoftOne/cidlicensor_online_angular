import {
  isFormValid,
  isControlValid,
  requireCheckboxesToBeCheckedValidator,
} from 'src/app/form';
import { IFormWizard } from './../../interfaces';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { MembershipRequest } from 'src/app/interfaces';

@Component({
  selector: 'ot-type-of-customer',
  templateUrl: './type-of-customer.component.html',
  styleUrls: ['./type-of-customer.component.scss'],
})
export class TypeOfCustomerComponent implements OnInit, IFormWizard {
  public formCustomerType: FormGroup;
  constructor() {}
  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() typeOfCustomer: any;

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    this.data.emit({ typeOfCustomer: this.typeOfCustomer });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    this.formCustomerType = new FormGroup({
      cbGroupCustomerType: new FormGroup(
        {
          typeOfCustomer: new FormControl(false),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
    });
  }
}
