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

  public isEditMode(): boolean {
    return (
      this.stateService.data.request &&
      this.stateService.data.request.applicationNumber &&
      this.stateService.data.request.applicationNumber > 0
    );
  }
}
