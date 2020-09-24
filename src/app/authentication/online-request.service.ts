import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USERTOKEN } from '../constants';
import { HttpRequestOptions } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class OnlineRequestService {
  constructor(private httpClient: HttpClient) {}

  public request(url: string, body: any, option: any): Observable<any> {
    const options = this.getOptions(option);

    return this.httpClient.post(url, body, options);
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, this.getOptions());
  }

  private getOptions(options?: HttpRequestOptions): any {
    let token = '';
    const cacheData = localStorage.getItem(USERTOKEN);

    if (JSON.parse(cacheData)) {
      token = JSON.parse(cacheData).token.auth_token;
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
