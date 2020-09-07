import {AfterViewInit, Component} from '@angular/core';
import * as scripts from './scripts.js';

@Component({
  selector: 'ot-track-your-progress',
  templateUrl: './track-your-progress.component.html',
  styleUrls: ['./track-your-progress.component.scss']
})
export class TrackYourProgressComponent implements AfterViewInit {

  constructor() {
  }

  ngAfterViewInit(): void {
    scripts();
  }

}
