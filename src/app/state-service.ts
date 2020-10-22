import { WizardState } from './wizards/interfaces';
import { AuthenticationService } from './authentication/authentication.service';
import { BehaviorSubject, combineLatest, of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApplicationState, MembershipRequest } from './interfaces';
import {
  CURRENT_STEP_TOKEN,
  customerTypes,
  getOpenType,
  getStatusFromId,
  isAcceptingApplicationStatus,
  newRequest,
  stepsAll,
} from './constants';
import { map, tap, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { getRequest, getApplicationNumber } from './wizards/wizard-selectors';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public data: ApplicationState = { request: newRequest, openType: 'New' };
  // public currentStep$: BehaviorSubject<string>;
  // public steps: string[];
  // public request$: BehaviorSubject<MembershipRequest>;
  // public request: Observable<MembershipRequest>;

  constructor(
    private authenticationService: AuthenticationService,
    private store: Store<WizardState>
  ) {
    this.store
      .pipe(select(getRequest))
      .pipe(tap((request) => (this.data.request = request)))
      .subscribe();

    this.store
      .pipe(select(getApplicationNumber))
      .pipe(tap((appNumber) => (this.data.openType = getOpenType(appNumber))))
      .subscribe();
  }
}
