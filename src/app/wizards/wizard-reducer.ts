import { UserToken } from './../authentication/interface';
import { customerTypes } from 'src/app/constants';
import { MembershipRequest, MembershipRequestResult } from './../interfaces';
import { WizardState } from './interfaces';
import { WizardAction } from './wizard-actions';
import {
  getUser,
  isAcceptingApplicationStatus,
  newRequest,
  stepsAll,
} from '../constants';
import ShortUniqueId from 'short-unique-id';

const initialState: WizardState = {
  currentStep: stepsAll[0],
  previousSteps: [],
  steps: stepsAll,
  request: newRequest,
  user: getUser(),
  submitRequest: '',
};
export function wizardReducer(
  state = initialState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case WizardAction.Next.type:
      const steps = state.steps;
      const index = steps.findIndex((x) => x === state.currentStep);

      let step = steps[index + 1];

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
      let req = {
        ...state.request,
        phoneNumber: action.payload.email,
      };

      if (action.payload.requestType > 0) {
        req = {
          ...req,
          membershipTypeId: action.payload.requestType,
          typeOfCustomer: customerTypes.find(
            (c) => c.id === action.payload.requestType
          ).name,
        };
      }

      const refreshedSteps = refreshSteps(req, action.payload);

      return {
        ...state,
        user: action.payload,
        request: req,
        steps: refreshedSteps,
        currentStep: refreshedSteps[0],
      };

    case WizardAction.LoadRequest.type:
      const refreshedReq = refreshSteps(action.payload, state.user);
      return {
        ...state,
        request: action.payload,
        steps: refreshedReq,
        currentStep: refreshedReq[0],
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
      const uniqueId = new ShortUniqueId();
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
      const newReq = {
        ...state.request,
        membershipTypeId: action.membershipTypeId,
        typeOfCustomer: action.typeOfCustomer,
      };

      const refreshedStepsForNew = refreshSteps(newReq, state.user);

      return {
        ...state,
        request: newReq,
        steps: refreshedStepsForNew,
        currentStep: refreshedStepsForNew[0],
      };

    case WizardAction.CreateMembershipNumberSuccess.type:
      return {
        ...state,
        request: {
          ...state.request,
          membershipNumber: action.payload,
        },
      };

    case WizardAction.CreateMembershipIdSuccess.type:
      return {
        ...state,
        request: {
          ...state.request,
          membershipId: action.payload,
        },
      };

    case WizardAction.CreateApplicationNumberSuccess.type:
      return {
        ...state,
        request: {
          ...state.request,
          applicationNumber: action.payload,
        },
      };

    default:
      return state;
  }
}

export function refreshSteps(
  request: MembershipRequestResult,
  user: UserToken
): string[] {
  return stepsAll.filter((s) => {
    if (user && (s === 'sPhoneNumber' || s === 'sVerifyPhone')) {
      return false;
    }

    if (
      s === 'sSearch' &&
      (request.membershipNumber.length > 1 ||
        isAcceptingApplicationStatus(request.status, request.applicationNumber))
    ) {
      return false;
    }

    if (
      s === 'sTypeOfCustomer' &&
      (isAcceptingApplicationStatus(
        request.status,
        request.applicationNumber
      ) ||
        user?.requestType > 0)
    ) {
      return false;
    }

    if (
      s === 'sTypeOfRequest' &&
      isAcceptingApplicationStatus(request.status, request.applicationNumber)
    ) {
      return false;
    }

    return true;
  });
}
