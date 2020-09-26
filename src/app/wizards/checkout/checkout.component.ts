import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IFormWizard, MembershipRequest, WINDOW } from './../../interfaces';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isFormValid, isControlValid } from 'src/app/form';
import { NgeniusPaymentService } from 'src/app/payment-gateway/payment-service';
import {
  CreateOrderResult,
  OrderTrackerResult,
} from 'src/app/payment-gateway/interfaces';
import { AngularFirestore } from 'angularfire2/firestore';
import { observable, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'ot-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, IFormWizard {
  private guid: string;
  constructor(
    private ngeniusPaymentService: NgeniusPaymentService,
    private toastrService: ToastrService,
    private db: AngularFirestore,

    @Inject(WINDOW) private window: Window
  ) {
    this.guid = uuidv4();
    this.orderStatus$ = this.getOrderStatus(this.guid);
  }
  @Output() nextStep = new EventEmitter<NgForm>();
  @Output() data = new EventEmitter<MembershipRequest>();

  public orderStatus$: Observable<OrderTrackerResult>;
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
            `${environment.apiUrl}/api/paymentGateway/CreateOrder`,
            {
              token: res.access_token,
              orderRequestBody: {
                action: 'SALE',
                amount: { currencyCode: 'AED', value: 100 },
                merchantAttributes: {
                  maskPaymentInfo: true,
                  redirectUrl: `${environment.ngeniousRedirectUrl}`,
                },
              },
            }
          )
        ),
        switchMap((orderResult: CreateOrderResult) => {
          if (orderResult._links?.payment) {
            return this.insertOrderTrackingRecord(orderResult.reference).pipe(
              tap(() => {
                return this.window.open(
                  orderResult._links.payment.href,
                  '_blank'
                );
              })
            );
          }
        }),

        catchError((err) => {
          this.toastrService.error(err);
          return undefined;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  private insertOrderTrackingRecord(orderRef: string): Observable<void> {
    return new Observable((observer) => {
      this.db
        .collection('orders')
        .doc(this.guid)
        .set({
          order: orderRef,
          lastAccess: new Date(),
          status: 'STARTED',
        })
        .then((res) => {
          observer.next();
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private updateSuccessOrderTrackingRecord(orderRef: string): Observable<void> {
    return new Observable((observer) => {
      this.db
        .collection('orders')
        .doc(this.guid)
        .update({
          order: orderRef,
          lastAccess: new Date(),
          status: 'SUCCESS',
        })
        .then((res) => {
          observer.next();
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private getOrderStatus(orderRef: string): Observable<OrderTrackerResult> {
    return this.db
      .collection('orders')
      .doc(this.guid)
      .valueChanges()
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        map((s: any) => ({
          order: s?.order,
          lastAccess: s?.lastAccess,
          status: s?.status,
        }))
      );
  }
}
