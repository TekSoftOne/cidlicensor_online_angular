import { AuthGuard } from './authentication/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { TrackYourProgressComponent } from './track-your-progress/track-your-progress.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-completed.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutSuccessComponent },
  {
    path: 'track-your-request',
    component: TrackYourProgressComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
