import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ot-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnChanges {
  public file: BehaviorSubject<File>;
  public sizeInvalid: Observable<boolean>;
  public lengthInvalid: Observable<boolean>;
  public submitChange = new BehaviorSubject<boolean>(false);

  @Output() data = new EventEmitter<File>();
  @Input() formSubmited = false;

  constructor() {
    this.file = new BehaviorSubject<File>(undefined);
    const submit = this.submitChange.asObservable();
    this.sizeInvalid = combineLatest([this.file, this.submitChange]).pipe(
      map(([f, isSubmit]) => {
        if (!isSubmit) {
          // not submit, dirty,.. => also valid
          return false; // = valid
        }

        if (!f) {
          // if not upload file, dont care = always valid
          return false;
        }

        return f.size > 100;
      })
    );

    this.lengthInvalid = combineLatest([this.file, this.submitChange]).pipe(
      map(([f, isSubmit]) => {
        if (!isSubmit) {
          // not submit, dirty,.. => also valid
          return false; // = valid
        }
        if (!f) {
          // file is not uploaded
          // if not upload file, always valid
          return true;
        }
        return false;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formSubmited) {
      this.submitChange.next(changes.formSubmited.currentValue);
    }
  }

  ngOnInit(): void {}

  public onFileChange(files: FileList): void {
    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
    const f = files.item(0);
    this.file.next(f);
    this.data.emit(f);
  }
}
