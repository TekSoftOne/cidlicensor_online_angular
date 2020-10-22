import { MembershipRequestResult } from './../interfaces';
import { UserToken } from './../authentication/interface';
import { MembershipRequest } from '../interfaces';

export interface WizardState {
  currentStep: string;
  previousSteps: string[];
  steps: string[];
  request: MembershipRequestResult;
  user: UserToken;
  submitRequest: string;
}
