import {
  getApplicationNumber,
  getRequest,
} from './../wizards/wizard-selectors';
import { WizardAction } from './../wizards/wizard-actions';
import { WizardState } from './../wizards/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
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
  customerTypes,
  isAvailableToRenewOrReplace,
  newRequest,
  readUrl,
} from '../constants';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

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
  public isNew$: Observable<boolean>;
  public isAvailableToRenew$: Observable<boolean>;

  constructor(
    private authentication: AuthenticationService,
    private translate: TranslateService,
    private stateService: StateService,
    private router: Router,
    private store: Store<WizardState>
  ) {
    this.imageUrl$ = new BehaviorSubject<string>(undefined);
    this.imageUrl = this.imageUrl$.asObservable().pipe(
      switchMap((url) => {
        return readUrl(url);
      })
    );

    this.isNew$ = this.store.pipe(select(getApplicationNumber)).pipe(
      map((appNumber) => {
        return !appNumber;
      })
    );

    this.isAvailableToRenew$ = this.store.pipe(select(getRequest)).pipe(
      map((request) => {
        return (
          isAvailableToRenewOrReplace(
            request.status,
            request.applicationNumber
          ) && this.router.url === '/'
        );
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

  public newRequest(e: Event): void {
    e.preventDefault();
    const membershipTypeId = this.authentication.getCustomerType();
    let typeOfCustomer = '';
    if (membershipTypeId && membershipTypeId > 0) {
      typeOfCustomer = customerTypes.find((x) => x.id === membershipTypeId)
        ?.name;
    }

    this.store.dispatch(
      new WizardAction.NewRequest(newRequest, membershipTypeId, typeOfCustomer)
    );

    this.router.navigateByUrl('/');
  }
}
