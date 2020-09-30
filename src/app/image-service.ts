import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public getBlobFromUrl(imageUrl: string): Observable<Blob> {
    return new Observable((observer) => {
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  public processImageUrl(imageUrl: string): Observable<any> {
    return this.getBlobFromUrl(imageUrl);
  }
}
