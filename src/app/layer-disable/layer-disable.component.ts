import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as overlayHelper from './overlay-helper.js';

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
    if (changes.activated && changes.activated.currentValue) {
      overlayHelper();
    }
  }

  ngOnInit(): void {}
}
