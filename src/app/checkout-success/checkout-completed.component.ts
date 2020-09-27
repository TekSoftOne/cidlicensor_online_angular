import { OrderDetail } from '../payment-gateway/interfaces';
import { NgeniusPaymentService } from '../payment-gateway/payment-service';
import { environment } from '../../environments/environment';
import { OnlineRequestService } from '../authentication/online-request.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {
  Observable,
  of,
  combineLatest,
  throwError,
  BehaviorSubject,
} from 'rxjs';
import { tap, switchMap, map, catchError, skip } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'ot-checkout-completed',
  templateUrl: './checkout-completed.component.html',
  styleUrls: ['./checkout-completed.component.scss'],
})
export class CheckoutSuccessComponent implements OnInit {
  public UnauthorizError: BehaviorSubject<boolean>;
  constructor(
    private orderSignalDb: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private onlineRequestService: OnlineRequestService,
    private ngeniusPaymentService: NgeniusPaymentService
  ) {
    this.UnauthorizError = new BehaviorSubject<boolean>(false);
    const state: RouterStateSnapshot = router.routerState.snapshot;
    const template = '?orderRef=';
    const index = state.url.indexOf(template);
    if (index > 0) {
      const urlLong = state.url.substring(
        state.url.indexOf(template),
        state.url.length
      );
      const orderRef = urlLong.replace(template, '');
      this.initalize(orderRef).subscribe();

      const retry$ = this.UnauthorizError.asObservable().pipe(
        skip(1),
        switchMap(() => {
          return this.ngeniusPaymentService
            .signIn()
            .pipe(tap(() => this.initalize(orderRef).subscribe()));
        })
      );

      retry$.subscribe();
    }
  }

  private initalize(orderRef: string): Observable<void> {
    return combineLatest([
      this.getGuidLink(orderRef),
      this.getOrderDetail(orderRef),
    ]).pipe(
      switchMap(([guid, detail]) =>
        this.updateSuccessOrderTrackingRecord(
          orderRef,
          guid,
          detail._embedded.payment[0]?.state
        )
      ),
      tap(() => {
        this.closeWindow();
      }),
      catchError((err) => {
        if (err.message === 'Unauthorized') {
          this.UnauthorizError.next(true);
          return of(undefined);
        }

        this.toastrService.error(err);
        this.closeWindow();
        return;
      })
    );
  }

  private closeWindow(): void {
    setTimeout(() => {
      window.close();
    }, 1000);
  }

  private getOrderDetail(orderRef: string): Observable<OrderDetail> {
    return this.onlineRequestService
      .request(`${environment.apiUrl}/api/paymentGateway/orderDetail`, {
        orderRef,
        token: this.ngeniusPaymentService.getToken(),
      })
      .pipe(
        map((order) => {
          if (order.error) {
            throw new Error(order.error);
          }

          return order;
        })
      );
  }

  ngOnInit(): void {}

  private updateSuccessOrderTrackingRecord(
    orderRef: string,
    orderGuid: string,
    status: string
  ): Observable<void> {
    return new Observable((observer) => {
      this.orderSignalDb
        .collection('orders')
        .doc(orderGuid)
        .update({
          order: orderRef,
          lastAccess: new Date(),
          status,
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private getGuidLink(orderRef: string): Observable<string> {
    return this.orderSignalDb
      .collection('guids')
      .doc(orderRef)
      .valueChanges()
      .pipe(map((s: any) => s.guid as string));
  }
}
