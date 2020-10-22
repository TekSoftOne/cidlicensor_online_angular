import { WizardState } from './interfaces';
import { createSelector } from 'reselect';
import { createFeatureSelector } from '@ngrx/store';
import { wizardStoreName } from './wizard-state';
import { isAcceptingApplicationStatus } from '../constants';

export const getWizardState = createFeatureSelector<WizardState>(
  wizardStoreName
);

export const getCurrentStep = createSelector(getWizardState, (state) => {
  return state.currentStep;
});

export const getRequest = createSelector(
  getWizardState,
  (state) => state.request
);

export const getApplicationNumber = createSelector(
  getWizardState,
  (state) => state.request.applicationNumber
);

export const getRequestStatus = createSelector(
  getRequest,
  (request) => request.status
);

export const getRequestCustomerType = createSelector(
  getRequest,
  (request) => request.membershipTypeId
);

export const getPreviousSteps = createSelector(
  getWizardState,
  (state) => state.previousSteps
);

export const getUserState = createSelector(
  getWizardState,
  (state) => state.user
);
