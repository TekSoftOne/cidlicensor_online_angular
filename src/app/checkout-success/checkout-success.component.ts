import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'ot-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(
    private orderSignalDb: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
    const state: RouterStateSnapshot = router.routerState.snapshot;
    const template = '?orderRef=';
    const index = state.url.indexOf(template);
    if (index > 0) {
      const urlLong = state.url.substring(
        state.url.indexOf(template),
        state.url.length
      );
      const orderRef = urlLong.replace(template, '');
      this.getGuidLink(orderRef)
        .pipe(
          switchMap((res: any) =>
            this.updateSuccessOrderTrackingRecord(orderRef, res.guid)
          ),
          tap(() => {
            setTimeout(() => {
              window.close();
            }, 1000);
          }),
          catchError((err) => {
            this.toastrService.error(err);
            return undefined;
          })
        )
        .subscribe();
    }
  }

  ngOnInit(): void {}

  private updateSuccessOrderTrackingRecord(
    orderRef: string,
    orderGuid: string
  ): Observable<void> {
    return new Observable((observer) => {
      this.orderSignalDb
        .collection('orders')
        .doc(orderGuid)
        .update({
          order: orderRef,
          lastAccess: new Date(),
          status: 'SUCCESS',
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
      .pipe(map((s) => s as string));
  }
}
