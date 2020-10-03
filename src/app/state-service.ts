import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApplicationState } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public data: ApplicationState = {};
  public currentStep$: BehaviorSubject<string>;
  public steps: string[];
  constructor() {
    this.currentStep$ = new BehaviorSubject<string>(undefined);
  }
}
