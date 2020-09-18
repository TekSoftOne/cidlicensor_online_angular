import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isFormValid, isControlValid } from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ot-search-membership-number',
  templateUrl: './search-membership-number.component.html',
  styleUrls: ['./search-membership-number.component.scss'],
})
export class SearchMembershipNumberComponent
  implements OnInit, IFormWizard, OnChanges {
  constructor(
    private licenseAuthenticationService: LicenseAuthenticationService
  ) {}

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() membershipNumber: string;
  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  public checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  public next(f: NgForm): void {
    this.data.emit({ membershipNumber: this.membershipNumber });
    this.nextStep.emit(f);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.membershipNumber && changes.membershipNumber.currentValue) {
      this.searchMembership().subscribe((membership) => {
        this.data.emit(membership);
      });
    }
  }

  private searchMembership(): Observable<MembershipRequest> {
    return this.licenseAuthenticationService
      .get(`${environment.licenseUrl}/api/common/membershipDetails`)
      .pipe(map((data) => data as MembershipRequest));
  }

  ngOnInit(): void {}
}
