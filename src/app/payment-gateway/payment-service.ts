import { OnlineRequestService } from './../authentication/online-request.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NGENIOUS_TOKEN } from '../constants';
import { HttpRequestOptions } from '../interfaces';
import { NGTokenResult } from './interfaces';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NgeniusPaymentService {
  constructor(
    private httpClient: HttpClient,
    private onlineRequestService: OnlineRequestService
  ) {}

  public post(url: string, body: any, option?: any): Observable<any> {
    const options = this.getOptions(option);

    return this.httpClient.post(url, body, options);
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, this.getOptions());
  }

  public signIn(): Observable<NGTokenResult> {
    return this.onlineRequestService
      .get(`${environment.apiUrl}/api/paymentGateway/getToken`)
      .pipe(
        map((token) => token as NGTokenResult),
        map((token) => {
          if (token.access_token) {
            localStorage.setItem(NGENIOUS_TOKEN, JSON.stringify(token));
            return token;
          }

          throw new Error('Can not access the payment gateway');
        })
      );
  }

  public getToken(): string {
    const cachedToken = localStorage.getItem(NGENIOUS_TOKEN);
    if (!cachedToken) {
      return null;
    }

    return (JSON.parse(cachedToken) as NGTokenResult).access_token;
  }

  private getOptions(options?: HttpRequestOptions): any {
    let token = '';
    const cacheData = localStorage.getItem(NGENIOUS_TOKEN);

    if (JSON.parse(cacheData)) {
      token = (JSON.parse(cacheData) as NGTokenResult).access_token;
    }

    if (options == null) {
      options = {};
    }

    if (options.headers == null) {
      options.headers = new HttpHeaders();
    }

    options.headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.ni-identity.v1+json',
      'Content-Type': 'application/vnd.ni-identity.v1+json',
    });
    return options;
  }
}
