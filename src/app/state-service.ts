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
import {
  getRequest,
  getApplicationNumber,
  getCurrentStep,
} from './wizards/wizard-selectors';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public state: ApplicationState = {
    request: newRequest,
    openType: 'New',
    currentStep: '',
  };
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
      .pipe(tap((request) => (this.state.request = request)))
      .subscribe();

    this.store
      .pipe(select(getApplicationNumber))
      .pipe(tap((appNumber) => (this.state.openType = getOpenType(appNumber))))
      .subscribe();

    this.store
      .pipe(select(getCurrentStep))
      .pipe(tap((currentStep) => (this.state.currentStep = currentStep)))
      .subscribe();
  }
}
