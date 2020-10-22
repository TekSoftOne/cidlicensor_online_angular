import { WizardState } from './../wizards/interfaces';
import { environment } from './../../environments/environment';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserToken, WINDOW } from './interface';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getUser, USERTOKEN } from '../constants';
import { select, Store } from '@ngrx/store';
import { getUserState } from '../wizards/wizard-selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly httpOptions = {};
  private readonly REDIRECT_LOGOUT = '/login';
  private user$: Observable<UserToken>;
  public user: UserToken;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private store: Store<WizardState>,
    @Inject(WINDOW) private window: Window
  ) {
    this.user$ = this.store
      .pipe(select(getUserState))
      .pipe(tap((u) => (this.user = u)));
  }

  public login(phoneNumber: string, password: string): Observable<UserToken> {
    return this.httpClient
      .post<UserToken>(`${environment.apiUrl}/api/auth/login`, {
        phoneNumber,
        password,
      })
      .pipe(
        tap((token) => {
          localStorage.setItem(USERTOKEN, JSON.stringify({ token }));
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(USERTOKEN);
    this.window.open(this.REDIRECT_LOGOUT, '_self');
  }

  public getExistingRequest(): number {
    return getUser()?.requests;
  }

  public getCustomerType(): number {
    return getUser()?.requestType;
  }

  public updateCustomerType(requestType: number): void {
    const token = getUser();
    token.requestType = requestType;
    localStorage.setItem(USERTOKEN, JSON.stringify({ token }));
  }

  public loginSilently(): UserToken | null {
    return getUser();
  }

  public isTokenValid(): boolean {
    return !!localStorage.getItem(USERTOKEN);
  }
}
