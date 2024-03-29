import { CustomValidation } from './../interfaces';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscribable,
  Subscription,
  of,
  Subject,
  combineLatest,
} from 'rxjs';
import { map, switchMap, skip, tap } from 'rxjs/operators';
import { readUrl } from '../constants';

@Component({
  selector: 'ot-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('imageUpload', { static: true }) inputImage: ElementRef;

  public imageUrl: Observable<string | undefined>;
  public image$: BehaviorSubject<File>;
  public imageFileSubscription: Subscription;
  public isInvalid: Observable<boolean>; // this is to know the validation inside this control
  @Input() formSubmitted = false;
  @Input() isRequired = false;
  @Input() image: File;
  @Input() controlName = 'an image controller';
  @Output() data: EventEmitter<File>;
  @Output() dataValidation: EventEmitter<CustomValidation>;

  private formSubmittedEvent$: BehaviorSubject<boolean>;
  private formSubmittedEvent: Observable<boolean>;

  constructor() {
    this.image$ = new BehaviorSubject<File>(undefined);
    this.formSubmittedEvent$ = new BehaviorSubject<boolean>(false);
    this.formSubmittedEvent = this.formSubmittedEvent$.asObservable();
    this.data = new EventEmitter<File>();
    this.dataValidation = new EventEmitter<CustomValidation>();
    this.imageUrl = this.image$.pipe(
      switchMap((file) => {
        if (!file) {
          return of(undefined);
        }
        return readUrl(file);
      })
    );

    this.isInvalid = combineLatest([
      this.formSubmittedEvent,
      this.imageUrl,
    ]).pipe(
      map(([summitStatus, url]) => {
        return summitStatus && this.isRequired && !url;
      }),
      tap((v) =>
        this.dataValidation.emit({
          controlName: this.controlName,
          isValid: !v,
        } as CustomValidation)
      )
    );

    const imageFile = this.image$.pipe(
      skip(1),
      tap((f) => {
        this.data.emit(f);
      })
    );

    this.imageFileSubscription = imageFile.subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formSubmitted) {
      this.formSubmittedEvent$.next(changes.formSubmitted.currentValue);
    }

    if (changes.image) {
      this.image$.next(changes.image.currentValue);
    }
  }
  ngOnDestroy(): void {
    if (this.imageFileSubscription) {
      this.imageFileSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {}

  // not depending on submit or not //this is so that the parent can know about this control
  public isControlValid(): boolean {
    if (!this.isRequired) {
      return true;
    }

    return this.image !== undefined;
  }

  public triggerImageUpload(): void {
    this.inputImage.nativeElement.click();
  }

  public onImageChange(files: FileList): void {
    const f = files[0];
    this.image$.next(f);
  }
}
