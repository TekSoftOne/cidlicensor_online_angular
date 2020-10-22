import { MembershipRequest } from './../interfaces';
import { WizardState } from './interfaces';
import { WizardAction } from './wizard-actions';
import { newRequest, stepsAll } from '../constants';

const initialState: WizardState = {
  currentStep: stepsAll[0],
  previousSteps: [],
  steps: stepsAll,
  request: newRequest,
  user: undefined,
};
export function wizardReducer(
  state = initialState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case WizardAction.Next.type:
      const index = state.steps.findIndex((x) => x === state.currentStep);

      let step = state.steps[index + 1];

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
        step = state.steps[this.getIndex(step) + 1];
      }

      state.previousSteps.push(state.currentStep);

      return {
        ...state,
        currentStep: step,
        previousSteps: state.previousSteps,
      };

    case WizardAction.Previous.type:
      let lastOne = state.previousSteps.pop();
      if (lastOne === 'sSearch') {
        lastOne = state.previousSteps.pop();
      }

      return {
        ...state,
        currentStep: lastOne,
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

    default:
      return state;
  }
}
