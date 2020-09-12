import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'ot-track-your-progress',
  templateUrl: './track-your-progress.component.html',
  styleUrls: ['./track-your-progress.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'ot-body',
  },
})
export class TrackYourProgressComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {}
}
