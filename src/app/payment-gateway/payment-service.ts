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
  constructor(private httpClient: HttpClient) {}

  public post(url: string, body: any, option?: any): Observable<any> {
    const options = this.getOptions(option);

    return this.httpClient.post(url, body, options);
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, this.getOptions());
  }

  public signIn(): Observable<boolean> {
    return this.httpClient
      .post(
        `${environment.ngeniousGateway}/identity/auth/access-token`,
        undefined,
        {
          headers: new HttpHeaders({
            Authorization: 'Basic ' + environment.ngeniousApiKey,
            'Content-Type': 'application/vnd.ni-identity.v1+json',
            'Access-Control-Allow-Origin': '*',
          }),
        }
      )
      .pipe(
        map((token) => token as NGTokenResult),
        map((token) => {
          if (token.access_token) {
            localStorage.setItem(NGENIOUS_TOKEN, JSON.stringify(token));
            return true;
          }

          throw new Error('Can not access the payment gateway');
        })
      );
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

    options.headers = options.headers.set('Authorization', `Bearer ${token}`);
    return options;
  }
}
