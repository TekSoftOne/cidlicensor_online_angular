export interface CreateOrderResult {
  _id: string;
  createDateTime: Date;
  action: string;
  amount: NGAmount;
  _links: NGLink;
}

export interface NGAmount {
  currencyCode: string;
  value: number;
}

export interface NGLink {
  payment: string;
}

export interface NGTokenResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface NGTokenError {
  message: string;
  code: number;
  errors: NGTokenErrorDetail[];
}

export interface NGTokenErrorDetail {
  message: string;
  localizedMessage: string;
  errorCode: string;
  domain: string;
}
