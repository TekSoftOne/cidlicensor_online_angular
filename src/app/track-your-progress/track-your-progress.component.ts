import { WizardAction } from './../wizards/wizard-actions';
import { ImageService } from 'src/app/image-service';
import { OnlineRequestService } from './../authentication/online-request.service';
import { MembershipRequestResult } from './../interfaces';
import { MembershipRequest } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin, combineLatest, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AfterViewInit, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { isFormValid } from '../form';
import { StateService } from '../state-service';

import {
  catchError,
  delay,
  delayWhen,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { baseName, blobToUrl, customerTypes } from '../constants';
import { WizardState } from '../wizards/interfaces';
import { Store } from '@ngrx/store';

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
  public appResult$: BehaviorSubject<MembershipRequestResult>;
  public appResult: Observable<MembershipRequestResult>;
  public loading = false;
  constructor(
    private toastrservice: ToastrService,
    private httpClient: HttpClient,
    private stateService: StateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private onlineRequestService: OnlineRequestService,
    private imageService: ImageService,
    private store: Store<WizardState>
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
      // tslint:disable-next-line: deprecation
      switchMap((appData) =>
        combineLatest([
          of(appData),
          this.imageService.processImageUrl(blobToUrl(appData.profilePic)),
        ])
      ),
      map(([appData, profileData]) => ({
        ...appData,
        // this case is because when Search for existing application, we dont load Type Of Customer or Type of Request
        membershipTypeId: appData.typeOfCustomer
          ? customerTypes.find((x) => x.name === appData.typeOfCustomer)?.id
          : undefined,
        profilePhoto: profileData,
      })),
      tap((app: any) => this.store.dispatch(new WizardAction.LoadRequest(app))),
      tap(() => this.router.navigateByUrl('home'))
    );
  }
  private getApplication(
    applicationNumber: string
  ): Observable<MembershipRequestResult | undefined> {
    this.loading = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };
    return this.onlineRequestService
      .request(
        `${environment.apiUrl}/api/MembershipRequests/search`,
        {
          applicationNumber: Number(applicationNumber),
          phoneNumber: this.authenticationService.user.email,
        },
        httpOptions
      )
      .pipe(
        map((app) => {
          if (!app) {
            throw new Error(
              'Cannot find this application number, please try another one'
            );
          }

          return app;
        }),
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = false;
          if (err.error && err.error.Message) {
            this.toastrservice.error(err.error.Message, 'Search Result');
          } else {
            this.toastrservice.error(err, 'Error when searching application');
          }
          return undefined;
        })
      );
  }

  public getBlobFromUrl(imageUrl: string): Observable<Blob> {
    return new Observable((observer) => {
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
