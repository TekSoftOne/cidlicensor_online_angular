import { environment } from './../environments/environment';
export const stepsAll = [
  'sPhoneNumber',
  'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  'sSearch',
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
  // 'sTypeOfCustomer',
  'sTypeOfRequest',
  // 'sSearch',
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

export const showNextButtonScreensAll = [
  'sPhoneNumber',
  'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  // 'sSearch', --search
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
  // 'sSearch',
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
  'sSearch',
  'sPersonalBasic',
  'sPersonalAdvanced',
  'sWorkInformation',
  'sLocationAreas',
  'lastDiv',
  // 'sPaymentChoices',
  'sReview',
  'sApplicationIdNotice',
];

export const STEPS_PERSONAL = [
  'sPhoneNumber',
  'sVerifyPhone',
  'sTypeOfCustomer',
  'sTypeOfRequest',
  'sSearch',
  'sPersonalBasic',
  'sPersonalAdvanced',
];

export const STEPS_LIMIT = ['sWorkInformation'];

export const STEPS_LOCATION = ['sLocationAreas'];

export const STEPS_SUBMIT = [
  'lastDiv',
  'sReview',
  'sPaymentChoices',
  'sApplicationIdNotice',
];

export const dateFormat = 'MM/dd/yyyy';

export const customerTypes = [
  { id: 1, name: 'Resident' },
  { id: 2, name: 'Diplomat' },
  { id: 3, name: 'Tourist' },
];

export const statuses = [
  { id: 1, name: 'New' },
  { id: 2, name: 'Pending' },
  { id: 3, name: 'Rejected' },
  { id: 4, name: 'Approved' },
];

export function getStatusFromId(id: number): string {
  return statuses.find((s) => s.id === id)?.name;
}

export const nationalities = [
  { name: 'Afghanistan', id: 1 },
  { name: 'Albania', id: 2 },
  { name: 'Algeria', id: 3 },
  { name: 'Argentina', id: 4 },
  { name: 'Australia', id: 6 },
  { name: 'Austria', id: 7 },
  { name: 'Bangladesh', id: 8 },
  { name: 'Belgium', id: 9 },
  { name: 'Bolivia', id: 10 },
  { name: 'Botswana', id: 11 },
  { name: 'Brazil', id: 12 },
  { name: 'Bulgaria', id: 13 },
  { name: 'Cambodia', id: 14 },
  { name: 'Cameroon', id: 15 },
  { name: 'Canada', id: 16 },
  { name: 'Chile', id: 17 },
  { name: 'China', id: 18 },
  { name: 'Colombia *', id: 19 },
  { name: 'Costa Rica', id: 20 },
  { name: 'Croatia', id: 21 },
  { name: 'Cuba', id: 22 },
  { name: 'Czech Republic', id: 23 },
  { name: 'Denmark', id: 24 },
  { name: 'Dominican Republic', id: 25 },
  { name: 'Ecuador', id: 26 },
  { name: 'Egypt', id: 27 },
  { name: 'El Salvador', id: 28 },
  { name: 'England', id: 29 },
  { name: 'Estonia', id: 31 },
  { name: 'Ethiopia', id: 32 },
  { name: 'Fiji', id: 33 },
  { name: 'Finland', id: 34 },
  { name: 'France', id: 35 },
  { name: 'Germany', id: 37 },
  { name: 'Ghana', id: 38 },
  { name: 'Greece', id: 39 },
  { name: 'Guatemala', id: 40 },
  { name: 'Haiti', id: 41 },
  { name: 'Honduras', id: 42 },
  { name: 'Hungary', id: 43 },
  { name: 'Iceland', id: 44 },
  { name: 'India', id: 45 },
  { name: 'Indonesia', id: 46 },
  { name: 'Iran', id: 47 },
  { name: 'Iraq', id: 48 },
  { name: 'Ireland', id: 49 },
  { name: 'Israel', id: 51 },
  { name: 'Italy', id: 52 },
  { name: 'Jamaica', id: 53 },
  { name: 'Japan', id: 54 },
  { name: 'Jordan', id: 55 },
  { name: 'Kenya', id: 56 },
  { name: 'Kuwait', id: 57 },
  { name: 'Laos', id: 58 },
  { name: 'Latvia', id: 59 },
  { name: 'Lebanon', id: 60 },
  { name: 'Libya', id: 61 },
  { name: 'Lithuania', id: 62 },
  { name: 'Madagascar', id: 63 },
  { name: 'Malaysia', id: 64 },
  { name: 'Mali', id: 65 },
  { name: 'Malta', id: 66 },
  { name: 'Mexico', id: 67 },
  { name: 'Mongolia', id: 68 },
  { name: 'Morocco', id: 69 },
  { name: 'Mozambique', id: 70 },
  { name: 'Namibia', id: 71 },
  { name: 'Nepal', id: 72 },
  { name: 'Netherlands', id: 73 },
  { name: 'New Zealand', id: 75 },
  { name: 'Nicaragua', id: 76 },
  { name: 'Nigeria', id: 77 },
  { name: 'Norway', id: 78 },
  { name: 'Pakistan', id: 79 },
  { name: 'Panama', id: 80 },
  { name: 'Paraguay', id: 81 },
  { name: 'Peru', id: 82 },
  { name: 'Philippines', id: 83 },
  { name: 'Poland', id: 84 },
  { name: 'Portugal', id: 85 },
  { name: 'Romania', id: 86 },
  { name: 'Russia', id: 87 },
  { name: 'Saudi Arabia', id: 88 },
  { name: 'Scotland', id: 89 },
  { name: 'Senegal', id: 90 },
  { name: 'Serbia', id: 91 },
  { name: 'Singapore', id: 92 },
  { name: 'Slovakia', id: 93 },
  { name: 'South Africa', id: 94 },
  { name: 'South Korea', id: 95 },
  { name: 'Spain', id: 96 },
  { name: 'Sri Lanka', id: 97 },
  { name: 'Sudan', id: 98 },
  { name: 'Sweden', id: 99 },
  { name: 'Switzerland', id: 100 },
  { name: 'Syria', id: 101 },
  { name: 'Taiwan', id: 102 },
  { name: 'Tajikistan', id: 103 },
  { name: 'Thailand', id: 104 },
  { name: 'Tonga', id: 105 },
  { name: 'Tunisia', id: 106 },
  { name: 'Turkey', id: 107 },
  { name: 'Ukraine', id: 108 },
  { name: 'United Arab Emirates', id: 109 },
  { name: '(The) United Kingdom', id: 110 },
  { name: '(The) United States', id: 111 },
  { name: 'Uruguay', id: 112 },
  { name: 'Venezuela', id: 113 },
  { name: 'Vietnam', id: 114 },
  { name: 'Wales', id: 115 },
  { name: 'Zambia', id: 117 },
  { name: 'Zimbabwe', id: 118 },
];

export const religions = [
  { name: 'Christians', id: 1 },
  { name: 'Hindus', id: 2 },
  { name: 'Muslims', id: 3 },
  { name: 'Buddhists', id: 4 },
  { name: 'Sikhs', id: 5 },
  { name: 'Jews', id: 6 },
  { name: 'Baháis', id: 7 },
  { name: 'Jainism', id: 8 },
  { name: 'Others', id: 9 },
];

export const CURRENT_STEP_TOKEN = 'OT_STEP';
export const PREVIOUS_STEP_TOKEN = 'OT_PREVIOUS_STEPS';
export const CURRENT_DATA_TOKEN = 'OT_D';

export const LICENSE_ROLE_NAME = 'Customer';
export const LICENSE_USER = 'ct@cidlicensor.com';
export const LICENSE_PASSWORD = '8tDvLmUW6vd4ckMMPnBY9';
