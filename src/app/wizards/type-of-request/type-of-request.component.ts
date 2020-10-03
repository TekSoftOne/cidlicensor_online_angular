import { TranslateService } from '@ngx-translate/core';
import { statuses } from './../../constants';
import {
  isFormValid,
  isControlValid,
  requireCheckboxesToBeCheckedValidator,
} from 'src/app/form';
import { IFormWizard, MembershipRequest } from './../../interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ot-type-of-request',
  templateUrl: './type-of-request.component.html',
  styleUrls: ['./type-of-request.component.scss'],
})
export class TypeOfRequestComponent implements OnInit, IFormWizard {
  constructor(
    private toastrservice: ToastrService,
    private translateService: TranslateService
  ) {}

  @Output() nextStep: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() data: EventEmitter<MembershipRequest> = new EventEmitter<
    MembershipRequest
  >();

  public formRequestType: FormGroup;
  @Input() enabled: boolean;
  @Input() typeOfRequest: any;
  checkFormInvalid(form: NgForm): boolean {
    return isFormValid(form);
  }
  checkControlInvalid(form: NgForm, control: any): boolean {
    return isControlValid(form, control);
  }
  next(f: NgForm): void {
    if (!f.valid) {
      this.toastrservice.error(
        this.translateService.instant(
          'WIZARD.TYPEOFREQUEST.ERROR.ATLEAST.TYPEOFREQUEST'
        )
      );
    }
    this.data.emit({ requestCategory: this.typeOfRequest });
    this.nextStep.emit(f);
  }

  ngOnInit(): void {
    this.formRequestType = new FormGroup({
      cbGroupRequestType: new FormGroup(
        {
          typeOfRequest: new FormControl(false),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
    });
  }
}
