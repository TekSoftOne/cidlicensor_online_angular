import { isControlValid } from 'src/app/form';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, combineLatest, merge, BehaviorSubject } from 'rxjs';
import { map, tap, skip, takeLast } from 'rxjs/operators';
import { CustomValidation } from '../interfaces';
import { truncate } from '../constants';

@Component({
  selector: 'ot-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnChanges {
  public file: BehaviorSubject<File>;
  public sizeInvalid: Observable<boolean>;
  public lengthInvalid: Observable<boolean>;
  public submitChange: BehaviorSubject<boolean>;
  public isValid: Observable<boolean>;
  public wantToChange$: BehaviorSubject<boolean>;
  public wantToChange: Observable<boolean>;
  public filePath$: BehaviorSubject<string>;

  @Output() data = new EventEmitter<File>();
  @Output() dataValidation = new EventEmitter<CustomValidation>();
  @Input() formSubmited = false;
  @Input() label: string;
  @Input() constrolName: string;
  @Input() isRequired = false;
  @Input() filePath: string;

  constructor() {
    this.file = new BehaviorSubject<File>(undefined);
    this.filePath$ = new BehaviorSubject<string>(undefined);
    this.wantToChange$ = new BehaviorSubject<boolean>(false);
    this.wantToChange = combineLatest([
      this.wantToChange$.asObservable(),
      this.filePath$.asObservable(),
    ]).pipe(
      map(([w, f]) => {
        if (w === true) {
          return true;
        }

        if (!f) {
          return true;
        }

        return false;
      })
    );

    this.submitChange = new BehaviorSubject<boolean>(false);
    const submit = this.submitChange.asObservable();
    this.sizeInvalid = combineLatest([this.file, submit]).pipe(
      map(([f, isSubmit]) => {
        if (!isSubmit && !f) {
          // not submit, dirty,.. => also valid
          return false; // = valid
        }

        if (!f) {
          // if not upload file, dont care = always valid
          return false;
        }

        return f.size / 1024 / 1024 >= 2;
      })
    );

    this.lengthInvalid = combineLatest([this.file, this.submitChange]).pipe(
      map(([f, isSubmit]) => {
        if (!this.isRequired) {
          return false;
        }
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

    this.isValid = merge(this.sizeInvalid, this.lengthInvalid).pipe(
      tap((s) => {
        this.dataValidation.emit({
          controlName: this.constrolName ?? 'unknown',
          isValid: !s,
        });
        console.log({
          controlName: this.constrolName,
          isValid: !s,
        });
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formSubmited) {
      this.submitChange.next(changes.formSubmited.currentValue);
    }

    if (changes.filePath) {
      this.filePath$.next(changes.filePath.currentValue);
    }
  }

  ngOnInit(): void {}

  // This is for parent to access and check whenever submitted
  public isControlValid(): boolean {
    if (!this.isRequired) {
      return true;
    }

    return (
      this.file.value &&
      this.file.value.size > 0 &&
      this.file.value.size / 1024 / 1024 < 2
    );
  }

  public onFileChange(files: FileList): void {
    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
    const f = files.item(0);
    this.file.next(f);
    this.data.emit(f);
  }

  public onWantToChange(e: Event): void {
    e.preventDefault();
    this.wantToChange$.next(true);
  }

  public getTruncate(text: string): string {
    return truncate(text, 50) + '...';
  }
}
