import { TranslateService } from '@ngx-translate/core';
import { OnlineRequestService } from './../../authentication/online-request.service';
import { HttpClient } from '@angular/common/http';
import {
  isFormValid,
  isControlValid,
  requireCheckboxesToBeCheckedValidator,
} from 'src/app/form';
import { IFormWizard } from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { MembershipRequest } from 'src/app/interfaces';
import { ToastrService } from 'ngx-toastr';
import { customerTypes } from 'src/app/constants';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ot-type-of-customer',
  templateUrl: './type-of-customer.component.html',
  styleUrls: ['./type-of-customer.component.scss'],
})
export class TypeOfCustomerComponent implements OnInit, IFormWizard {
  public formCustomerType: FormGroup;
  constructor(
    private toastrservice: ToastrService,
    private translateService: TranslateService
  ) {}

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() typeOfCustomer: any;
  @Input() enabled: boolean;

  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    if (!f.valid) {
      this.toastrservice.error(
        this.translateService.instant(
          'WIZARD.TYPEOFCUSTOMER.ERROR.ATLEAST.TYPEOFCUSTOMER'
        )
      );
    }
    this.data.emit({
      typeOfCustomer: this.typeOfCustomer,
      membershipTypeId: customerTypes.find(
        (x) => x.name === this.typeOfCustomer
      )?.id,
    });
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
