import { AuthenticationService } from './authentication/authentication.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApplicationState, MembershipRequest } from './interfaces';
import {
  CURRENT_STEP_TOKEN,
  getStatusFromId,
  isAcceptingApplicationStatus,
  stepsAll,
} from './constants';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public data: ApplicationState = {};
  public currentStep$: BehaviorSubject<string>;
  public steps: string[];
  constructor(private authenticationService: AuthenticationService) {
    this.currentStep$ = new BehaviorSubject<string>(
      this.initializeCurrentStep()
    );
    this.steps = stepsAll;

    combineLatest([of(stepsAll), this.authenticationService.user])
      .pipe(
        map(([steps, user]) => {
          return steps.filter((s) => {
            if (user && (s === 'sPhoneNumber' || s === 'sVerifyPhone')) {
              return false;
            }

            return true;
          });
        }),
        tap((s) => (this.steps = s))
      )
      .subscribe();
  }

  public initializeCurrentStep(): string {
    const cacheStep = localStorage.getItem(CURRENT_STEP_TOKEN);
    if (cacheStep) {
      return cacheStep;
    }

    if (!this.steps) {
      return stepsAll[0];
    }

    return this.steps[0];
  }

  public getSteps(request: MembershipRequest): string[] {
    const steps = this.steps.filter((s) => {
      if (
        this.authenticationService.getUser() &&
        (s === 'sPhoneNumber' || s === 'sVerifyPhone')
      ) {
        return false;
      }

      if (
        s === 'sSearch' &&
        (request.membershipNumber.length > 1 ||
          isAcceptingApplicationStatus(request.status))
      ) {
        return false;
      }

      if (
        s === 'sTypeOfCustomer' &&
        isAcceptingApplicationStatus(request.status)
      ) {
        return false;
      }

      if (
        s === 'sTypeOfRequest' &&
        isAcceptingApplicationStatus(request.status)
      ) {
        return false;
      }

      return true;
    });

    this.currentStep$.next(steps[0]);

    return steps;
  }
}
