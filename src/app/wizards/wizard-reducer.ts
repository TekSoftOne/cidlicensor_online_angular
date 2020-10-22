import { MembershipRequest } from './../interfaces';
import { WizardState } from './interfaces';
import { WizardAction } from './wizard-actions';
import {
  getUser,
  isAcceptingApplicationStatus,
  newRequest,
  stepsAll,
} from '../constants';

const initialState: WizardState = {
  currentStep: stepsAll[0],
  previousSteps: [],
  steps: stepsAll,
  request: newRequest,
  user: getUser(),
};
export function wizardReducer(
  state = initialState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case WizardAction.Next.type:
      const steps = getSteps(state);
      const index = steps.findIndex((x) => x === state.currentStep);

      let step = steps[index + 1];

      if (!state.request.phoneNumber) {
        // user get to home page from last session
        state.request.phoneNumber = state.user.email;
      }

      if (state.currentStep === 'sReview') {
        if (
          !state.request.email ||
          !state.request.fullName ||
          !state.request.phoneNumber
        ) {
          this.toastrservice.error('Email and PhoneNumber is required');
          return;
        }

        this.updateStatus = this.processApplication();
      }

      if (step === 'sSearch' && state.request.requestCategory === 'New') {
        // dont want to search if (New)
        const i = steps.findIndex((s) => s === step);
        step = steps[i + 1];
      }

      const previousOnes = [...state.previousSteps];

      previousOnes.push(state.currentStep);

      return {
        ...state,
        steps,
        currentStep: step,
        previousSteps: previousOnes,
      };

    case WizardAction.Previous.type:
      const previousSteps = [...state.previousSteps];
      let lastOne = previousSteps.pop();
      if (lastOne === 'sSearch') {
        lastOne = previousSteps.pop();
      }

      return {
        ...state,
        currentStep: lastOne,
        previousSteps,
      };

    case WizardAction.Login.type:
      return {
        ...state,
        user: action.payload,
      };

    case WizardAction.LoadRequest.type:
      return {
        ...state,
        request: action.payload,
      };

    case WizardAction.LoadSteps.type:
      return {
        ...state,
        steps: action.payload,
      };

    case WizardAction.LoadWizards.type:
      return {
        ...action.payload,
      };

    case WizardAction.MergeRequestData.type:
      const request = {
        ...state.request,
        ...action.payload,
      };
      return {
        ...state,
        request,
      };

    case WizardAction.SubmitRequest.type:
      return {
        ...state,
        currentStep: 'sApplicationIdNotice',
      };

    case WizardAction.CreateApplicationSuccess.type:
      return {
        ...state,
        request: {
          ...state.request,
          applicationNumber: action.payload,
        },
      };

    case WizardAction.Search.type:
      return { ...state, currentStep: 'sPersonalBasic' };

    case WizardAction.NewRequest.type:
      return {
        ...state,
        request: {
          ...state.request,
          membershipTypeId: action.membershipTypeId,
          typeOfCustomer: action.typeOfCustomer,
        },
      };

    default:
      return state;
  }
}

export function getSteps(state: WizardState): string[] {
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
        state.user?.requestType > 0)
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
}
