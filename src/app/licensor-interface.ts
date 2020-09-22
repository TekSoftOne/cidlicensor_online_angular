export interface MembershipDetailInLicensor {
  membershipId: number;
  membershipTypeId: number;
  membershipNumber: string;
  membershipNumberOld: string;
  permitNumber: string;
  fullName: string;
  gender: string;
  address: string;
  phoneNumber: string;
  secondaryAddress: string;
  secondaryPhoneNumber: string;
  email: string;
  birthDate: Date;
  religionId: number;
  nationalityId: number;
  salary: number;
  limit: number;
  emiratesIDNumber: string;
  passportNumber: string;
  passportAttachment: string;
  visaAttachment: string;
  profilePic: string;
  attachment1: string;
  attachment2: string;
  attachment3: string;
  salesPointUserId: string;
  notes: string;
  status: string; // enum
  nationName: string;
  religionName: string;
  occupation: string;
  visaResidency: string;
  statusString: string;
  requestCategory: string; // enum
  requestCategoryString: string;
  applicationNumber: string;
  membershipRequestType: string; // enum
}
