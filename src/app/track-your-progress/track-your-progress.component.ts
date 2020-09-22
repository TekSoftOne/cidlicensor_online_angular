import { MembershipRequest } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AfterViewInit, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { isFormValid } from '../form';
import { StateService } from '../state-service';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'ot-track-your-progress',
  templateUrl: './track-your-progress.component.html',
  styleUrls: ['./track-your-progress.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'ot-body',
  },
})
export class TrackYourProgressComponent implements AfterViewInit {
  public appResult$: BehaviorSubject<MembershipRequest>;
  public appResult: Observable<MembershipRequest>;
  constructor(
    private toastrservice: ToastrService,
    private httpClient: HttpClient,
    private stateService: StateService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.appResult$ = new BehaviorSubject<any>(undefined);
    this.appResult = this.appResult$.asObservable();
  }

  public checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  ngAfterViewInit(): void {}

  public OnSearchApplication(form: NgForm): void {
    if (!form.valid) {
      this.toastrservice.error('Application Number needs to be 8 numbers');
    }

    const appId = form.controls.applicationNumber.value;

    this.appResult = this.getApplication(appId).pipe(
      tap((app) => (this.stateService.data.request = app)),
      tap(() => this.router.navigateByUrl('home'))
    );
  }

  private getApplication(
    applicationNumber: string
  ): Observable<MembershipRequest | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };
    return this.httpClient
      .post(
        `${environment.apiUrl}/api/MembershipRequests/search`,
        {
          applicationNumber: Number(applicationNumber),
          phoneNumber: this.authenticationService.getUser().email,
        },
        httpOptions
      )
      .pipe(
        map((app) => {
          if (!app) {
            this.toastrservice.error(
              'Cannot find this application number, please try another one',
              'Search Result'
            );
          }
          return app;
        }),
        catchError((err) => {
          if (err.error && err.error.Message) {
            this.toastrservice.error(err.error.Message, 'Search Result');
          } else {
            this.toastrservice.error(err, 'Error when searching application');
          }
          return undefined;
        })
      );
  }
}
