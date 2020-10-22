import { Observable } from 'rxjs';
import { WizardState } from './../wizards/interfaces';
import { StateService } from './../state-service';
import {
  getStatusFromId,
  isAcceptingApplicationStatus,
  statuses,
} from './../constants';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getRequest } from '../wizards/wizard-selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ot-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent implements OnInit {
  @Input() requestStatus: number;

  public isEditMode$: Observable<boolean>;
  constructor(private store: Store<WizardState>) {
    this.isEditMode$ = this.store.pipe(select(getRequest)).pipe(
      map((request) => {
        return (
          request && request.applicationNumber && request.applicationNumber > 0
        );
      })
    );
  }

  ngOnInit(): void {}

  public resolvedStatus(): string {
    return getStatusFromId(this.requestStatus);
  }
}
