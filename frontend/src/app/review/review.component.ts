import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router'; 


export interface ReviewData {
  // business_id: string;
  // cool: number;
  // date: string;
  // funny: number;
  // review_id: string;
  stars: number;
  text: string;
  // useful: number;
  // user_id: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ReviewComponent>,
    private http: HttpClient,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ReviewData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  submit(): void {
      var business_id = String(this.router.url).split('/')[2];
      this.http
        .post(`${environment.apiUrl}/review/${business_id}`, {
          text:this.data.text,
          stars: this.data.stars
        }).subscribe(data => {
          console.log(data)
      })
          
    this.dialogRef.close();
  }
}
