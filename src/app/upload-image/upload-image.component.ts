import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscribable,
  Subscription,
  of,
} from 'rxjs';
import { map, switchMap, skip, tap } from 'rxjs/operators';

@Component({
  selector: 'ot-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit, OnDestroy {
  @ViewChild('imageUpload', { static: true }) inputImage: ElementRef;

  public imageUrl: Observable<string | undefined>;
  public image: BehaviorSubject<File>;
  public imageFileSubscription: Subscription;
  @Output() data: EventEmitter<File>;

  constructor() {
    this.image = new BehaviorSubject<File>(undefined);
    this.imageUrl = this.image.pipe(
      switchMap((file) => {
        if (!file) {
          return of(undefined);
        }
        return this.readUrl(file);
      })
    );
    this.data = new EventEmitter<File>();

    const imageFile = this.image.pipe(
      skip(1),
      tap((f) => {
        this.data.emit(f);
      })
    );

    this.imageFileSubscription = imageFile.subscribe();
  }
  ngOnDestroy(): void {
    if (this.imageFileSubscription) {
      this.imageFileSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {}

  public triggerImageUpload(): void {
    this.inputImage.nativeElement.click();
  }

  public onImageChange(files: FileList): void {
    const f = files[0];
    this.image.next(f);
  }

  // tslint:disable-next-line: typedef
  public readUrl(file: any): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.readAsDataURL(file);
    });
  }
}
