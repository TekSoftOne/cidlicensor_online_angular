import { getStatusFromId, statuses } from './../constants';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ot-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent implements OnInit {
  @Input() requestStatus: number;

  constructor() {}

  ngOnInit(): void {}

  public resolvedStatus(): string {
    return getStatusFromId(this.requestStatus);
  }
}
