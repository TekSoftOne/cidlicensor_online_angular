import { environment } from './../environments/environment';
export const steps = [
  'sPhoneNumber',
  'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  'serDiv1',
  'sPersonalBasic',
  'sPersonalAdvanced',
  'sWorkInformation',
  'sLocationAreas',
  'lastDiv',
  // 'sPaymentChoices',
  'sReview',
  'sApplicationIdNotice',
];

export const showPreviousButtonScreens = [
  // 'sPhoneNumber',
  // 'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  // 'serDiv1',
  'sPersonalBasic',
  'sPersonalAdvanced',
  'sWorkInformation',
  'sLocationAreas',
  'lastDiv',
  // 'sPaymentChoices',
  'sReview',
];

if (environment.production === false) {
  showPreviousButtonScreens.push('sApplicationIdNotice');
}

export const showNextButtonScreens = [
  'sPhoneNumber',
  'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  // 'serDiv1', --search
  'sPersonalBasic',
  'sPersonalAdvanced',
  'sWorkInformation',
  'sLocationAreas',
  'lastDiv',
  // 'sPaymentChoices',
  'sReview',
  // 'sApplicationIdNotice',
];

export const showHomeScreens = [
  'sPhoneNumber',
  'sVerifyPhone',
  // 'sTypeOfCustomer',
  // 'sTypeOfRequest',
  // 'serDiv1',
  // 'sPersonalBasic',
  // 'sPersonalAdvanced',
  // 'sWorkInformation',
  // 'sLocationAreas',
  // 'lastDiv',
  // 'sPaymentChoices',
  // 'sReview',
  // 'sApplicationIdNotice',
];

export const showStepsFlowScreens = [
  // 'sPhoneNumber',
  // 'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  'serDiv1',
  'sPersonalBasic',
  'sPersonalAdvanced',
  'sWorkInformation',
  'sLocationAreas',
  'lastDiv',
  // 'sPaymentChoices',
  'sReview',
  'sApplicationIdNotice',
];

export const dateFormat = 'MM/dd/yyyy';

export const customerTypes = [
  { id: 1, name: 'resident' },
  { id: 2, name: 'diplomat' },
  { id: 3, name: 'tourist' },
];

export const CURRENT_STEP_TOKEN = 'OT_STEP';
export const CURRENT_DATA_TOKEN = 'OT_D';

export const LICENSE_ROLE_NAME = 'SalesPoint';
