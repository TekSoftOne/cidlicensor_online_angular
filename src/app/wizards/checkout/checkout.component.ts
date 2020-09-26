import { StateService } from './../../state-service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IFormWizard, MembershipRequest, WINDOW } from './../../interfaces';
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { isFormValid, isControlValid } from 'src/app/form';
import { NgeniusPaymentService } from 'src/app/payment-gateway/payment-service';
import {
  CreateOrderResult,
  OrderTrackerResult,
} from 'src/app/payment-gateway/interfaces';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'ot-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, IFormWizard {
  private guid: string;
  public width$: BehaviorSubject<number>;
  constructor(
    private ngeniusPaymentService: NgeniusPaymentService,
    private toastrService: ToastrService,
    private stateService: StateService,
    private db: AngularFirestore,

    @Inject(WINDOW) private window: Window
  ) {
    this.guid = uuidv4();
    this.orderStatus$ = this.getOrderStatus(this.guid);
    this.width$ = new BehaviorSubject<number>(this.getWidth());
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
                amount: { currencyCode: 'AED', value: 270 },
                merchantAttributes: {
                  maskPaymentInfo: true,
                  redirectUrl: `${environment.ngeniousRedirectUrl}`,
                  skipConfirmationPage: true,
                },
              },
            }
          )
        ),
        switchMap((orderResult: CreateOrderResult) => {
          if (orderResult._links?.payment) {
            this.stateService.data.currentOrderGUID = this.guid;
            return this.insertGuidLink(orderResult.reference).pipe(
              switchMap(() =>
                this.insertOrderTrackingRecord(orderResult.reference)
              ),
              tap(() => {
                const h = (screen.height / 6) * 5;
                const w = (screen.width / 4) * 3;

                const x = screen.width / 2 - w / 2;
                const y = screen.height / 2 - h / 2;

                return window.open(
                  orderResult._links.payment.href,
                  'Resource',
                  'toolbar=no ,status=no,titlebar=no,menubar=no,width=' +
                    w +
                    ',height=' +
                    h +
                    ',left=' +
                    x +
                    ',top=' +
                    y
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

  private getWidth(): number {
    return screen.width;
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.width$.next(this.getWidth());
  }

  ngOnInit(): void {}

  private insertGuidLink(orderRef: string): Observable<void> {
    return new Observable((observer) => {
      this.db
        .collection('guids')
        .doc(orderRef)
        .set({
          guid: this.guid,
        })
        .then((res) => {
          observer.next();
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

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
