import { WizardState } from './interfaces';
import { createSelector } from 'reselect';
import { createFeatureSelector } from '@ngrx/store';
import { wizardStoreName } from './wizard-state';
import { isAcceptingApplicationStatus } from '../constants';

export const getWizardState = createFeatureSelector<WizardState>(
  wizardStoreName
);

export const getSteps = createSelector(getWizardState, (state) => {
  return state.steps.filter((s) => {
    if (state.user && (s === 'sPhoneNumber' || s === 'sVerifyPhone')) {
      return false;
    }

    if (
      s === 'sSearch' &&
      (state.request.membershipNumber.length > 1 ||
        isAcceptingApplicationStatus(
          state.request.status,
          state.request.applicationNumber
        ))
    ) {
      return false;
    }

    if (
      s === 'sTypeOfCustomer' &&
      (isAcceptingApplicationStatus(
        state.request.status,
        state.request.applicationNumber
      ) ||
        state.user.requestType > 0)
    ) {
      return false;
    }

    if (
      s === 'sTypeOfRequest' &&
      isAcceptingApplicationStatus(
        state.request.status,
        state.request.applicationNumber
      )
    ) {
      return false;
    }

    return true;
  });
});

export const getCurrentStep = createSelector(getWizardState, (state) => {
  return state.steps[0];
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
