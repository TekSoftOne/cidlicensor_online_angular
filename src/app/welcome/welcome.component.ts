import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ot-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  @Input() requestStatus: string;
  @Input() applicationNumber: string;
  constructor() {}
  ngOnInit(): void {}
  public isApprovedRequest(): string {
    return this.requestStatus;
  }
}
