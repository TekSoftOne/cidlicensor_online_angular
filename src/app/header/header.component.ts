import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { CURRENT_STEP_TOKEN } from '../constants';

@Component({
  selector: 'ot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private language = 'en';

  @Input() userImage: string = undefined;
  constructor(
    private authentication: AuthenticationService,
    private translate: TranslateService
  ) {}

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
}
