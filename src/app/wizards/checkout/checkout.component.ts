import { paymentTypes } from './../../constants';
import { TranslateService } from '@ngx-translate/core';
import { StateService } from './../../state-service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import {
  catchError,
  map,
  startWith,
  switchMap,
  tap,
  timestamp,
} from 'rxjs/operators';
import {
  IFormWizard,
  MembershipRequest,
  PaymentInfoLicensor,
  WINDOW,
} from './../../interfaces';
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
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
import {
  BehaviorSubject,
  observable,
  Observable,
  combineLatest,
  of,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LicenseAuthenticationService } from 'src/app/authentication/licensor/license-authentication.service';
import { requestCategories } from 'src/app/constants';

@Component({
  selector: 'ot-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, IFormWizard {
  private guid: string;
  public width$: BehaviorSubject<number>;
  public loading = false;
  public loadingGateway = false;
  public currentWindow: any;
  public showPaymentDialog$: BehaviorSubject<boolean>;

  constructor(
    private ngeniusPaymentService: NgeniusPaymentService,
    private toastrService: ToastrService,
    public stateService: StateService,
    private db: AngularFirestore,
    private translateService: TranslateService,
    private licenseAuthenticationService: LicenseAuthenticationService,
    @Inject(WINDOW) private window: Window
  ) {
    this.showPaymentDialog$ = new BehaviorSubject<boolean>(false);
    this.guid = uuidv4();

    this.loading = true;
    this.orderStatus$ = combineLatest([
      of(this.orderRef),
      this.getOrderStatus(this.guid),
    ]).pipe(
      switchMap(([currentOrderRef, orderRef]) => {
        if (currentOrderRef) {
          console.log('checkout success online');

          return of({
            order: currentOrderRef,
            lastAccess: new Date(),
            status: 'SUCCESS',
          } as OrderTrackerResult);
        }

        return of(orderRef);
      }),
      tap(() => (this.loading = false)),
      tap(() => this.checkingOut.emit(false)),
      catchError((err) => {
        this.toastrService.error(err);
        this.loading = false;
        return of(undefined);
      })
    );

    const allowNext$ = this.orderStatus$.pipe(
      map((s) => {
        switch (s.status) {
          case 'CAPTURED':
            this.data.emit({
              orderRef: s.order,
              paymentType: this.paymentType,
            });
            this.submitRequest.emit();
            break;
          case 'FAILED':
            this.toastrService.error(
              'Payment proccessing failure',
              'Payment Gateway'
            );
            break;
        }
      })
    );

    allowNext$.subscribe();

    this.width$ = new BehaviorSubject<number>(this.getWidth());
  }
  @Output() nextStep = new EventEmitter<NgForm>();
  @Output() submitRequest = new EventEmitter<NgForm>();
  @Output() data = new EventEmitter<MembershipRequest>();
  @Output() checkingOut = new EventEmitter<boolean>();

  public orderStatus$: Observable<OrderTrackerResult>;
  @Input() paymentType: string;

  @Input() orderRef: string;
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    if (!this.paymentType && !this.orderRef) {
      this.toastrService.error(
        this.translateService.instant('WIZARD.CHECKOUT.ERROR.ATLEAST.PAYMENT')
      );
      return;
    }

    if (this.paymentType === 'cash') {
      this.nextStep.emit(f);
      this.data.emit({
        paymentType: this.paymentType,
      });
      return;
    }

    if (this.orderRef && this.orderRef.length > 0) {
      this.nextStep.emit(f);
      this.data.emit({
        paymentType: this.paymentType,
      });
      return;
    }
    this.checkingOut.emit(true);
    this.loadingGateway = true;
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
                this.showPaymentDialog$.next(true);

                this.currentWindow = window.open(
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

                const closeCheck = (popup: any) => {
                  const check = setInterval(() => {
                    try {
                      // tslint:disable-next-line: no-unused-expression
                      (popup == null || popup.closed) &&
                        (clearInterval(check), this.onWindowClosed());
                    } catch (ex) {}
                  }, 500);
                };

                closeCheck(this.currentWindow);
              })
            );
          }
        }),
        tap(() => (this.loadingGateway = false)),
        catchError((err) => {
          this.toastrService.error(err);
          this.loadingGateway = false;
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

  public onWindowClosed(): void {
    this.showPaymentDialog$.next(false);
    this.checkingOut.emit(false);
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
