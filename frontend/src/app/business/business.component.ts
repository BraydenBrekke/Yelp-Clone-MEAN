import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToolbarService} from "../toolbar.service";
import {MatDialog} from "@angular/material/dialog";
import {ReviewComponent, ReviewData} from "../review/review.component";

@Component({
  selector: 'app-review',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  business: any;
  reviews: any;

  stars: number = 0;
  text: string = "";

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private toolbarService: ToolbarService, public dialog: MatDialog) {
    this.business = this.router.getCurrentNavigation()?.extras?.state;

    if (!this.business) {
      const ls: any = localStorage.getItem('business');

      this.route.paramMap.subscribe(paramMap => {
        const busId = paramMap.get('id');

        if (ls && JSON.parse(ls)['business_id'] == busId) {
          this.business = JSON.parse(ls);
          console.log(this.business);
        } else {
          router.navigateByUrl('/');
        }
      })
    }
  }

  getAllReviews() {
    this.http.get(`${environment.apiUrl}/review/${this.business.business_id}`)
      .subscribe((reviews: any) => {
        const maxLen = 500;
        for (let i = 0; i < reviews.length; i++) {
          let isLong = reviews[i].text.length > maxLen;
          reviews[i].text = reviews[i].text.substring(0, maxLen) + (isLong ? "..." : "");
        }
        this.reviews = reviews;

        console.log(this.reviews);
      });
  }

  postReview(data: ReviewData) {
    // Post new or edited reviews here.
    alert(JSON.stringify(data));
  }

  openReviewDialog() {
    const dialogRef = this.dialog.open(ReviewComponent, {
      width: '250px',
      data: {
        stars: this.stars,
        text: this.text
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postReview(result);
      }
    });
  }

  ngOnInit() {
    this.getAllReviews();

    if (this.toolbarService.subsVar == undefined) {
      this.toolbarService.subsVar = this.toolbarService.invokeOpenReviewDialog.subscribe((name: string) => {
        this.openReviewDialog();
      });
    }
  }

}
