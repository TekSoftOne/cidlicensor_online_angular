import { Observable, BehaviorSubject, observable } from 'rxjs';
import { StateService } from './../state-service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  CURRENT_STEP_TOKEN,
  isAcceptingApplicationStatus,
  isAvailableToRenewOrReplace,
  newRequest,
  readUrl,
} from '../constants';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  private language = 'en';

  @Input() userImage: Blob = undefined;
  public imageUrl: Observable<any>;
  public imageUrl$: BehaviorSubject<string>;
  constructor(
    private authentication: AuthenticationService,
    private translate: TranslateService,
    private stateService: StateService,
    private router: Router
  ) {
    this.imageUrl$ = new BehaviorSubject<string>(undefined);
    this.imageUrl = this.imageUrl$
      .asObservable()
      .pipe(switchMap((url) => readUrl(url)));
  }

  ngOnInit(): void {}

  public isIn(): boolean {
    return this.authentication.isTokenValid();
  }

  public logout(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.authentication.logout();
  }

  public changeLanguage(e: Event): void {
    e.preventDefault();
    this.setLanguage();
    this.translate.use(this.language);
  }

  private setLanguage(): void {
    if (this.language === 'en') {
      this.language = 'ar';
    } else {
      this.language = 'en';
    }
  }

  public loadHome(e: Event): void {
    e.preventDefault();
    if (this.stateService.steps) {
      this.stateService.currentStep$.next(this.stateService.steps[0]);
    }
    this.router.navigateByUrl('/');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userImage) {
      this.imageUrl$.next(changes.userImage.currentValue);
    }
  }

  public isNew(): boolean {
    return !this.stateService.data.request.applicationNumber;
  }

  public isAvailableToRenew(): boolean {
    return isAvailableToRenewOrReplace(
      this.stateService.data.request.status,
      this.stateService.data.request.applicationNumber
    );
  }

  public newRequest(): void {
    this.stateService.data.request = newRequest;
    window.location.href = '/';
  }
}
