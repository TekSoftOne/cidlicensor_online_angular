import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LICENSE_ROLE_NAME } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class LicenseAuthenticationService {
  private readonly LICENSE_TOKEN = 'OR_LICENSE_TOKEN';
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    private httpClient: HttpClient
  ) {}

  public getAccess(): Observable<boolean> {
    if (localStorage.getItem(this.LICENSE_TOKEN)) {
      return of(true);
    }

    return this.httpClient
      .post(`${environment.licenseUrl}/api/Auth/login`, {
        username: `${environment.licenseUser}`,
        password: `${environment.licensePassword}`,
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

  public request(url: string, body: any): Observable<any> {
    return this.httpClient.post(url, body, this.getOptions());
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, this.getOptions());
  }

  private getOptions(): any {
    let token = '';
    const cacheData = localStorage.getItem(this.LICENSE_TOKEN);

    if (JSON.parse(cacheData)) {
      token = JSON.parse(cacheData).auth_token;
    }

    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
  }
}
