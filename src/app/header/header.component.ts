import { Observable, BehaviorSubject, observable, of } from 'rxjs';
import { StateService } from './../state-service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  CURRENT_STEP_TOKEN,
  customerTypes,
  isAcceptingApplicationStatus,
  isAvailableToRenewOrReplace,
  newRequest,
  readUrl,
} from '../constants';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  private language = 'en';

  @Input() userImage: Blob = undefined;
  public imageUrl: Observable<any>;
  public imageUrl$: BehaviorSubject<string>;
  constructor(
    private authentication: AuthenticationService,
    private translate: TranslateService,
    private stateService: StateService,
    private router: Router
  ) {
    this.imageUrl$ = new BehaviorSubject<string>(undefined);
    this.imageUrl = this.imageUrl$.asObservable().pipe(
      switchMap((url) => {
        return of(undefined);
      })
    );
  }

  ngOnInit(): void {}

  public isIn(): boolean {
    return this.authentication.isTokenValid();
  }

  public logout(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.authentication.logout();
  }

  public changeLanguage(e: Event): void {
    e.preventDefault();
    this.setLanguage();
    this.translate.use(this.language);
  }

  private setLanguage(): void {
    if (this.language === 'en') {
      this.language = 'ar';
    } else {
      this.language = 'en';
    }
  }

  public loadHome(e: Event): void {
    e.preventDefault();
    this.router.navigateByUrl('/');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userImage) {
      this.imageUrl$.next(changes.userImage.currentValue);
    }
  }

  public isNew(): boolean {
    return !this.stateService.data.request.applicationNumber;
  }

  public isAvailableToRenew(): boolean {
    return isAvailableToRenewOrReplace(
      this.stateService.data.request.status,
      this.stateService.data.request.applicationNumber
    );
  }

  public newRequest(e: Event): void {
    e.preventDefault();
    const membershipTypeId = this.authentication.getCustomerType();
    let typeOfCustomer = '';
    if (membershipTypeId && membershipTypeId > 0) {
      typeOfCustomer = customerTypes.find(
        (x) => x.id === this.stateService.data.request.membershipId
      )?.name;
    }

    const req = {
      ...newRequest,
      membershipTypeId,
      typeOfCustomer,
    };
    this.stateService.request$.next(req);

    if (this.stateService.steps) {
      this.stateService.currentStep$.next(this.stateService.getSteps(req)[0]);
    }

    this.router.navigateByUrl('/');
  }
}
