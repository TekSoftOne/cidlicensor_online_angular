import {AfterViewInit, Component} from '@angular/core';
import * as scripts from './scripts.js';

@Component({
  selector: 'ot-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  constructor() {
  }

  private static createGoogleMapsScript(): void {
    if (document.getElementById('google-apis')) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyBHpAmimxTn6JfSP_-1PavnZ9WvAE6eCtc&libraries=places&callback=initAutocomplete';
    script.async = true;
    script.defer = true;
    script.id = 'google-apis';
    document.body.insertAdjacentElement('beforeend', script);
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
