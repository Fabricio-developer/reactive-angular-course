import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$: Observable<boolean> =this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {

    return of(null).pipe(
      // Side effect the loading outside funciton
      tap(() => this.loadingOn()),
      // Capture the param obsevable and concating to the subscription
      concatMap(() => obs$),
      // at end of function, triggers the loadingOff function
      finalize(() => this.loadingOff()),
    )
  }

  public loadingOn() {
    this.loadingSubject.next(true);
  }

  public loadingOff() {
    this.loadingSubject.next(false);
  }
}
