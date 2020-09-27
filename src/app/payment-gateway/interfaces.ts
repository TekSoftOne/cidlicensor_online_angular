export interface CreateOrderResult {
  _id: string;
  reference: string;
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
  payment: NGPayment;
}

export interface NGPayment {
  href: string;
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

export interface OrderTrackerResult {
  order?: string;
  lastAccess?: Date;
  status?: string;
}

export interface OrderDetail {
  _embedded: OrderDetailEmbedded;
}

export interface OrderDetailEmbedded {
  payment: OrderDetailPayment[];
}

export interface OrderDetailPayment {
  state: string;
}
