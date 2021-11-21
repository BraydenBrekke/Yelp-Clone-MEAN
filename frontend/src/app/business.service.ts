import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  invokeReviewRefresh = new EventEmitter();
  subsVar: Subscription | undefined;

  constructor() {
  }

  refreshReviews() {
    this.invokeReviewRefresh.emit();
  }
}
