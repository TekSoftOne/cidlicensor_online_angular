import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
declare var $: any;

@Component({
  selector: 'ot-checkout-process-layer',
  templateUrl: './checkout-process-layer.component.html',
  styleUrls: ['./checkout-process-layer.component.scss'],
})
export class CheckoutProcessLayerComponent implements OnInit, OnChanges {
  @Input() activated: boolean;
  @Input() popup: any;
  @ViewChild('checkoutOverlay', { static: true }) checkoutOverlay: ElementRef;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.activated) {
      return;
    }

    if (changes.activated.currentValue === true) {
      $(this.checkoutOverlay.nativeElement).show();
    } else {
      $(this.checkoutOverlay.nativeElement).hide();
    }
  }

  ngOnInit(): void {}

  public relaunch(): void {
    if (this.popup) {
      this.popup.focus();
    }
  }
}
