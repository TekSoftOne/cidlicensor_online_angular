import { LICENSE_PASSWORD } from './../../constants';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LICENSE_ROLE_NAME, LICENSE_USER } from 'src/app/constants';
import { HttpRequestOptions } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LicenseAuthenticationService {
  private readonly LICENSE_TOKEN = 'LICENSE_TOKEN';
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    private httpClient: HttpClient
  ) {}

  public getAccessSilently(): Observable<boolean> {
    if (localStorage.getItem(this.LICENSE_TOKEN)) {
      localStorage.removeItem(this.LICENSE_TOKEN);
      return this.connect();
    }

    return this.connect();
  }

  public getAccessForcely(): Observable<boolean> {
    this.removeAccessCache();
    return this.connect();
  }

  private connect(): Observable<boolean> {
    return this.httpClient
      .post(`${environment.licenseUrl}/api/Auth/login`, {
        username: LICENSE_USER,
        password: LICENSE_PASSWORD,
      })
      .pipe(
        map((user: any) => {
          if (user.role === LICENSE_ROLE_NAME) {
            localStorage.setItem(this.LICENSE_TOKEN, JSON.stringify(user));

            return true;
          } else {
            throw new Error('You are not authorized to access this panel!');
          }
        })
      );
  }

  public removeAccessCache(): void {
    localStorage.removeItem(this.LICENSE_TOKEN);
  }

  public request(url: string, body: any, options?: any): Observable<any> {
    return this.httpClient.post(url, body, this.getOptions(options));
  }

  public post(url: string, body: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };

    return this.httpClient.post(url, body, this.getOptions(httpOptions));
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, this.getOptions());
  }

  private getOptions(options?: HttpRequestOptions): any {
    let token = '';
    const cacheData = localStorage.getItem(this.LICENSE_TOKEN);

    if (JSON.parse(cacheData)) {
      token = JSON.parse(cacheData).auth_token;
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
