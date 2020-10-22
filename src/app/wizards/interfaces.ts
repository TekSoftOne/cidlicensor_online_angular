import { UserToken } from './../authentication/interface';
import { MembershipRequest } from '../interfaces';

export interface WizardState {
  currentStep: string;
  previousSteps: string[];
  steps: string[];
  request: MembershipRequest;
  user: UserToken;
}
