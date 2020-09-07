import {AfterViewInit, Component} from '@angular/core';
import * as scripts from './scripts.js';

@Component({
  selector: 'tr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  constructor() {
  }

  ngAfterViewInit(): void {
    scripts();
  }

}
