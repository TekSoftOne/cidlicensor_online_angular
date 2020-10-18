import { StateService } from './../state-service';
import {
  getStatusFromId,
  isAcceptingApplicationStatus,
  statuses,
} from './../constants';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ot-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent implements OnInit {
  @Input() requestStatus: number;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {}

  public resolvedStatus(): string {
    return getStatusFromId(this.requestStatus);
  }

  public isAccepting(): boolean {
    return isAcceptingApplicationStatus(
      this.stateService.data.request.status,
      this.stateService.data.request.applicationNumber
    );
  }
}
