import { IFormWizard, MembershipRequest } from 'src/app/interfaces';
import { dateFormat, religions, nationalities } from './../../constants';
import { environment } from './../../../environments/environment';
import { Observable, combineLatest, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isFormValid, isControlValid } from 'src/app/form';
import { MembershipDetailInLicensor } from '../../licensor-interface';
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
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ImageService } from 'src/app/image-service';

@Component({
  selector: 'ot-search-membership-number',
  templateUrl: './search-membership-number.component.html',
  styleUrls: ['./search-membership-number.component.scss'],
})
export class SearchMembershipNumberComponent
  implements OnInit, IFormWizard, OnChanges {
  public loading = false;
  constructor(
    private licenseAuthenticationService: LicenseAuthenticationService,
    private toastrservice: ToastrService,
    private datePipe: DatePipe,
    private imageService: ImageService
  ) {}

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  @Input() membershipNumber: string;

  @Input() currentPhoneNumber: string; // phone nnumber of the current customer
  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  public checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  public next(f: NgForm): void {
    if (!f.valid) {
      return;
    }

    this.loading = true;
    this.searchMembership(this.membershipNumber)
      .pipe(
        map((data: any) => data.details),
        switchMap((membershipDetail: MembershipDetailInLicensor) => {
          return combineLatest([
            of(membershipDetail),
            this.imageService.processImageUrl(membershipDetail.profilePic),
          ]).pipe(
            map(([membership, profilePic]) => {
              return {
                phoneNumber: membership.phoneNumber,
                fullName: membership.fullName,
                email: membership.email,
                address: membership.address,
                fullAddress: membership.occupation,
                nationId: nationalities.find(
                  (n) => n.name === membership.nationName
                )?.id,
                nationName: membership.nationName,
                // emiratesIdBack: membership.attachment1,
                // emiratesIdFront: membership.attachment2,
                // passportAttachement: membership.attachment3,
                profilePhoto: profilePic,
                // authorizationLetter: membership.visaAttachment,
                // typeOfCustomer: membership.membershipTypeId,
                membershipTypeId: membership.membershipTypeId,
                requestCategory: membership.requestCategoryString,
                membershipNumber: membership.membershipNumber,
                emiratesIDNumber: membership.emiratesIDNumber,
                passportNumber: membership.passportNumber,
                gender: Number(membership.gender),
                // genderName:
                birthDate: this.datePipe.transform(
                  membership.birthDate,
                  dateFormat
                ),
                religionId: religions.find(
                  (r) => r.name === membership.religionName
                )?.id,
                religionName: membership.religionName,
                // step
                monthlySalary: membership.salary,
                monthlyQuota: membership.limit,
                // comment: membership
                // areaId?
                // locationId: number;
                // visaResidency: membership.visaResidency,
                // locationAddress?;
                // agentId?;
                membershipId: membership.membershipId,
              };
            })
          );
        }),
        tap((membershipRequest) => {
          this.data.emit(membershipRequest);
        }),
        tap(() => this.nextStep.emit(f)),
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.toastrservice.error(err);
          this.loading = false;
          return undefined;
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  private searchMembership(
    membershipNumber: string
  ): Observable<MembershipRequest> {
    return this.licenseAuthenticationService
      .get(
        `${environment.licenseUrl}/api/common/membershipDetails?number=${membershipNumber}`
      )
      .pipe(map((data) => data as MembershipRequest));
  }

  ngOnInit(): void {}
}
