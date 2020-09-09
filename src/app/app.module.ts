import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TrackYourProgressComponent } from './track-your-progress/track-your-progress.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  HttpClientModule,
  HttpClient,
  HttpClientJsonpModule,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MobileComponent } from './wizards/mobile/mobile.component';
import { MobileVerificationComponent } from './wizards/mobile-verification/mobile-verification.component';
import { PersonalInformationComponent } from './wizards/personal-information/personal-information.component';
// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    TrackYourProgressComponent,
    MobileComponent,
    MobileVerificationComponent,
    PersonalInformationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
