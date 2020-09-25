import { environment } from 'src/environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { IFormWizard, MembershipRequest, WINDOW } from './../../interfaces';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isFormValid, isControlValid } from 'src/app/form';
import { NgeniusPaymentService } from 'src/app/payment-gateway/payment-service';
import { CreateOrderResult } from 'src/app/payment-gateway/interfaces';

@Component({
  selector: 'ot-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, IFormWizard {
  constructor(
    private ngeniusPaymentService: NgeniusPaymentService,
    @Inject(WINDOW) private window: Window
  ) {}
  @Output() nextStep = new EventEmitter<NgForm>();
  @Output() data = new EventEmitter<MembershipRequest>();
  public paymentType: string;
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    if (this.paymentType === 'cash') {
      console.log('cash');
    }

    this.ngeniusPaymentService
      .signIn()
      .pipe(
        switchMap((res) =>
          this.ngeniusPaymentService.post(
            `${environment.ngeniousGateway}/transactions/outlets/${environment.ngeniousOutlet}/orders`,
            {
              action: 'SALE',
              amount: { currencyCode: 'AED', value: 100 },
              merchantAttributes: {
                maskPaymentInfo: true,
                redirectUrl: `${
                  environment.ngeniousRedirectUrl
                }/checkout-success?id=${99999}`,
              },
            }
          )
        ),
        tap((orderResult: CreateOrderResult) => {
          if (orderResult._links.payment) {
            this.window.open(orderResult._links.payment, '_blank');
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}
}
