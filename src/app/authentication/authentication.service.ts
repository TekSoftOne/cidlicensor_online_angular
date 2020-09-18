import { environment } from './../../environments/environment';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserToken, WINDOW } from './interface';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly USERTOKEN = 'OR_USER';
  private readonly httpOptions = {};
  private readonly REDIRECT_LOGOUT = '/';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {}

  public login(phoneNumber: string, password: string): Observable<UserToken> {
    return this.httpClient
      .post<UserToken>(`${environment.apiUrl}/api/auth/login`, {
        phoneNumber,
        password,
      })
      .pipe(
        tap((token) => {
          localStorage.setItem(this.USERTOKEN, JSON.stringify(token));
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.USERTOKEN);
    this.window.open(this.REDIRECT_LOGOUT, '_self');
  }

  public loginSilently(): UserToken | null {
    const cachedUser = localStorage.getItem(this.USERTOKEN);
    if (!cachedUser) {
      return null;
    }

    return JSON.parse(cachedUser);
  }

  public isTokenValid(): boolean {
    return !!localStorage.getItem(this.USERTOKEN);
  }
}
