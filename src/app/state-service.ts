import { AuthenticationService } from './authentication/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApplicationState, MembershipRequest } from './interfaces';
import { CURRENT_STEP_TOKEN, stepsAll } from './constants';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public data: ApplicationState = {};
  public currentStep$: BehaviorSubject<string>;
  public steps: string[];
  constructor(private authenticationService: AuthenticationService) {
    this.currentStep$ = new BehaviorSubject<string>(this.loadCurrentStep());
    this.steps = stepsAll;
  }

  public loadCurrentStep(): string {
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
    return stepsAll.filter((s) => {
      if (
        this.authenticationService.getUser() &&
        (s === 'sPhoneNumber' || s === 'sVerifyPhone')
      ) {
        return false;
      }

      if (s === 'sSearch' && request.membershipNumber.length > 1) {
        return false;
      }

      return true;
    });
  }
}
