import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ot-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() loading = false;
  constructor() {}

  ngOnInit(): void {}
}
