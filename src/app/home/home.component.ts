import { AfterViewInit, Component } from '@angular/core';
import * as scripts from './scripts.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ot-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  constructor(private translate: TranslateService) {}
  public language = 'en';

  private static createGoogleMapsScript(): void {
    if (document.getElementById('google-apis')) {
      return;
    }
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyBHpAmimxTn6JfSP_-1PavnZ9WvAE6eCtc&libraries=places&callback=initAutocomplete';
    script.async = true;
    script.defer = true;
    script.id = 'google-apis';
    document.body.insertAdjacentElement('beforeend', script);
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

  ngAfterViewInit(): void {
    try {
      scripts();
    } catch (e) {
      console.warn(e);
    }
    setTimeout(HomeComponent.createGoogleMapsScript);
  }
}
