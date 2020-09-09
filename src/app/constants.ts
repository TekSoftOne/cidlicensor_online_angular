export const steps = [
  'mainDiv',
  'mainDiv2',
  'ftDiv',
  'ftDiv2',
  'serDiv1',
  'ftDiv3',
  'ftDiv4',
  'sdDiv',
  'tdDiv',
  'lastDiv',
  'lastDiv2',
  'lastDiv3',
  'lastDiv4',
];

export const showPreviousButtonScreens = [
  // 'mainDiv',
  // 'mainDiv2',
  // 'ftDiv',
  'ftDiv2',
  // 'serDiv1',
  'ftDiv3',
  'ftDiv4',
  'sdDiv',
  'tdDiv',
  'lastDiv',
  'lastDiv2',
  'lastDiv3',
  //'lastDiv4',
];

export const showNextButtonScreens = [
  'mainDiv',
  'mainDiv2',
  'ftDiv',
  'ftDiv2',
  // 'serDiv1', --search
  'ftDiv3',
  'ftDiv4',
  'sdDiv',
  'tdDiv',
  'lastDiv',
  'lastDiv2',
  'lastDiv3',
  //'lastDiv4',
];

export const showHomeScreens = [
  'mainDiv',
  'mainDiv2',
  // 'ftDiv',
  // 'ftDiv2',
  // 'serDiv1',
  // 'ftDiv3',
  // 'ftDiv4',
  // 'sdDiv',
  // 'tdDiv',
  // 'lastDiv',
  // 'lastDiv2',
  // 'lastDiv3',
  // 'lastDiv4',
];

export const showStepsFlowScreens = [
  //'mainDiv',
  //'mainDiv2',
  'ftDiv',
  'ftDiv2',
  'serDiv1',
  'ftDiv3',
  'ftDiv4',
  'sdDiv',
  'tdDiv',
  'lastDiv',
  'lastDiv2',
  'lastDiv3',
  'lastDiv4',
];

export interface Nationality {
  name: string;
  id: number;
}

export interface MembershipRequest {
  phoneNumber?: string;
  verifyNumber?: string;
  fullName?: string;
  emailAddress?: string;
  address?: string;
  fullAddress?: string;
}
