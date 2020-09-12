import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AfterViewInit, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { isFormValid } from '../form';

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
  public appResult$: BehaviorSubject<any>;
  public appResult: Observable<any>;
  constructor(
    private toastrservice: ToastrService,
    private httpClient: HttpClient
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
      this.toastrservice.warning('Application Number needs to be 8 numbers');
    }

    const appId = form.controls.applicationNumber.value;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };
    this.httpClient
      .post(
        `${environment.apiUrl}/api/MembershipRequests/search`,
        {
          applicationNumber: Number(appId),
        },
        httpOptions
      )
      .subscribe(
        (appNumber) => {
          if (!appNumber) {
            this.toastrservice.warning(
              'Cannot find this application number, please try another one',
              'Search Result'
            );
          }
          this.appResult$.next(appNumber);
        },
        (error) => {
          this.toastrservice.error(error, 'Error when searching application');
        }
      );
  }
}
