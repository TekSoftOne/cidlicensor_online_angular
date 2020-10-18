import { observable, Observable, Subscriber } from 'rxjs';
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
  'sPaymentChoices',
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
  'sPaymentChoices',
  'sReview',
];

if (environment.production === false) {
  if (environment.enableTestData) {
    showPreviousButtonScreens.push('sApplicationIdNotice');
  }
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
  'sPaymentChoices',
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
  'sPaymentChoices',
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
  { id: 2, name: 'Approved' },
  { id: 3, name: 'Rejected' },
  { id: 4, name: 'Pending' },
  { id: 11, name: 'APPROVED_BY_AGENT_WAITING_FOR_ADMIN' },
];

export const newRequest = {
  nationId: 0,
  religionId: 0,
  gender: 0,
  areaId: '0',
  membershipNumber: '0',
  membershipRequestType: 2,
  status: statuses.find((s) => s.name === 'Pending')?.id,
  monthlyQuota: 0,
  monthlySalary: 0,
};

export function getStatusFromId(id: number): string {
  return statuses.find((s) => s.id === id)?.name;
}

export function isAcceptingApplicationStatus(
  status: number,
  applicationNumber?: number
): boolean {
  return (
    getStatusFromId(status) !== 'Approved' &&
    getStatusFromId(status) !== 'Rejected' &&
    applicationNumber !== undefined &&
    applicationNumber > 0
  );
}

export function isAvailableToRenewOrReplace(
  status: number,
  applicationNumber?: number
): boolean {
  return (
    getStatusFromId(status) === 'Approved' ||
    getStatusFromId(status) === 'Rejected'
  );
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

export function toBase64FromFile(file): Observable<any> {
  return new Observable((observer) => {
    const reader = new FileReader();

    reader.onload = () => {
      const binaryString = reader.result as string;
      observer.next(btoa(binaryString));
      observer.complete();
    };

    reader.readAsBinaryString(file);

    reader.onerror = (error) => observer.error(error);
  });
}

export function isBase64FromFile(str): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

export const CURRENT_STEP_TOKEN = 'OT_STEP';
export const PREVIOUS_STEP_TOKEN = 'OT_PREVIOUS_STEPS';
export const CURRENT_DATA_TOKEN = 'OT_D';

export const LICENSE_ROLE_NAME = 'Customer';
export const LICENSE_USER = 'ct@cidlicensor.com';
export const LICENSE_PASSWORD = '8tDvLmUW6vd4ckMMPnBY9';

export const USERTOKEN = 'OR_USER';
export const NGENIOUS_TOKEN = 'NGENIOUS_USER';

export function b64toBlob(b64Data, contentType = '', sliceSize = 512): Blob {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export function blobToUrl(b64Data): string {
  const contentType = 'image/png';

  const blob = b64toBlob(b64Data, contentType);
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

export function baseName(str): string {
  // tslint:disable-next-line: no-construct
  let base = new String(str).substring(str.lastIndexOf('/') + 1);
  if (base.lastIndexOf('.') !== -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}

export function truncate(str, n): string {
  return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}

// tslint:disable-next-line: typedef
export function readUrl(file: any): Observable<string> {
  return new Observable((observer) => {
    const reader = new FileReader();
    reader.onload = () => {
      observer.next(reader.result as string);
      observer.complete();
    };
    reader.readAsDataURL(file);
  });
}

export const paymentTypes = [
  { name: 'cash', id: 1 },
  { name: 'payonline', id: 2 },
];

// need in licensor
export const requestCategories = [
  { name: 'New', id: 1 },
  { name: 'Renewal', id: 2 },
  { name: 'Replacement', id: 3 },
  { name: 'RequestUpdate', id: 4 },
];

export const monthlySalaryRanges = [
  { name: '2000 AED - 3500 AED', id: 3500 },
  { name: '3500 AED - 5000 AED', id: 5000 },
  { name: '5000 AED - 6500 AED', id: 6500 },
  { name: '6500 AED - 8000 AED', id: 8000 },
  { name: '8000 AED - 9500 AED', id: 9500 },
  { name: '9500 AED - 11000 AED', id: 11000 },
  { name: '11000 AED - 13500 AED', id: 13500 },
  { name: '13500 AED  - 15000 AED', id: 15000 },
  { name: '15000 AED - 16500 AED', id: 16500 },
  { name: '16500 AED - 18000 AED', id: 18000 },
  { name: '18000 AED - 19500 AED', id: 19500 },
  { name: '20000 AED &amp; Above', id: 20000 },
];

export const monthlyQuotaRanges = [
  { name: '1000', id: 1000 },
  { name: '1500', id: 1500 },
  { name: '2500', id: 2500 },
  { name: '3000', id: 3000 },
  { name: '3500', id: 3500 },
  { name: '4000', id: 4000 },
  { name: '4500', id: 4500 },
];
