import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { wizardStoreName } from './wizard-state';
import { wizardReducer } from './wizard-reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(wizardStoreName, wizardReducer),
  ],
  exports: [],
  providers: [],
})
export class WizardModule {
  constructor() {}
}
