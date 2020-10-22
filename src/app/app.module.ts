import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { TrackYourProgressComponent } from './track-your-progress/track-your-progress.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LicenseAuthenticationService } from './authentication/licensor/license-authentication.service';
import { StateService } from './state-service';
import { ImageService } from './image-service';

import {
  HttpClientModule,
  HttpClient,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MobileComponent } from './wizards/mobile/mobile.component';
import { MobileVerificationComponent } from './wizards/mobile-verification/mobile-verification.component';
import { PersonalInformationComponent } from './wizards/personal-information/personal-information.component';
import { PersonalInformationAdvancedComponent } from './wizards/personal-information-advanced/personal-information-advanced.component';
import { TypeOfCustomerComponent } from './wizards/type-of-customer/type-of-customer.component';
import { TypeOfRequestComponent } from './wizards/type-of-request/type-of-request.component';
import { SearchMembershipNumberComponent } from './wizards/search-membership-number/search-membership-number.component';
import { WorkInformationComponent } from './wizards/work-information/work-information.component';
import { LocationComponent } from './wizards/location/location.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { DatePipe } from '@angular/common';
import { SummaryComponent } from './wizards/summary/summary.component';
import { AuthenticationService } from './authentication/authentication.service';
import { HeaderComponent } from './header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestStatusComponent } from './request-status/request-status.component';
import { LayerDisableComponent } from './layer-disable/layer-disable.component';
import { AuthenticationInterceptor } from './authentication/authentication-interceptor';
import { LoaderComponent } from './loader/loader.component';
import { OnlineRequestService } from './authentication/online-request.service';
import { NgeniusPaymentService } from './payment-gateway/payment-service';
import { CheckoutComponent } from './wizards/checkout/checkout.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { CheckoutSuccessComponent } from './checkout-success/checkout-completed.component';
import { CheckoutProcessLayerComponent } from './checkout-process-layer/checkout-process-layer.component';
import { StoreModule } from '@ngrx/store';
import { WizardModule } from './wizards/wizard.module';
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
    PersonalInformationAdvancedComponent,
    TypeOfCustomerComponent,
    TypeOfRequestComponent,
    SearchMembershipNumberComponent,
    WorkInformationComponent,
    LocationComponent,
    UploadFileComponent,
    UploadImageComponent,
    SummaryComponent,
    HeaderComponent,
    WelcomeComponent,
    RequestStatusComponent,
    LayerDisableComponent,
    LoaderComponent,
    CheckoutComponent,
    CheckoutSuccessComponent,
    CheckoutProcessLayerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    WizardModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    DatePipe,
    AuthenticationService,
    LicenseAuthenticationService,
    StateService,
    OnlineRequestService,
    AuthenticationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    NgeniusPaymentService,
    ImageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
