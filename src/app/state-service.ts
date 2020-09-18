import { Injectable } from '@angular/core';
import { ApplicationState } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public data: ApplicationState = {};
  constructor() {}
}
