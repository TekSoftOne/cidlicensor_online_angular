import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as overlayHelper from './overlay-helper.js';
declare var $: any;
@Component({
  selector: 'ot-layer-disable',
  templateUrl: './layer-disable.component.html',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'ot-overlay-target',
  },
  styleUrls: ['./layer-disable.component.scss'],
})
export class LayerDisableComponent implements OnInit, OnChanges {
  @Input() activated: boolean;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activated) {
      if (changes.activated.currentValue) {
        $('.ot-overlay').show();
      } else {
        $('.ot-overlay').hide();
      }
    }
  }

  ngOnInit(): void {
    if (this.activated) {
      $('.ot-overlay').show();
    } else {
      $('.ot-overlay').hide();
    }
  }
}
