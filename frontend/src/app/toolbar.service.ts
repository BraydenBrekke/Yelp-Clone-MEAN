import {Subscription} from "rxjs";
import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  invokeOpenReviewDialog = new EventEmitter();
  subsVar: Subscription | undefined;

  constructor() {
  }

  openReviewDialog() {
    this.invokeOpenReviewDialog.emit();
  }
}
