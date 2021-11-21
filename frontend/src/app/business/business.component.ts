import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToolbarService} from "../toolbar.service";
import {MatDialog} from "@angular/material/dialog";
import {ReviewComponent, ReviewData} from "../review/review.component";
import {BusinessService} from "../business.service";

@Component({
  selector: 'app-review',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  business: any;
  reviews: any;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;

  stars: number = 0;
  text: string = "";

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private toolbarService: ToolbarService, private businessService: BusinessService, public dialog: MatDialog) {
    this.business = this.router.getCurrentNavigation()?.extras?.state;

    if (!this.business) {
      const ls: any = localStorage.getItem('business');

      this.route.paramMap.subscribe(paramMap => {
        const busId = paramMap.get('id');

        if (ls && JSON.parse(ls)['business_id'] == busId) {
          this.business = JSON.parse(ls);
        } else {
          router.navigateByUrl('/');
        }
      })
    }
  }

  getAllReviews(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.http.get(`${environment.apiUrl}/review/${this.business.business_id}?page=` + this.currentPage + '&limit=' + this.pageSize)
      .subscribe((reviews: any) => {
        const maxLen = 500;
        for (let i = 0; i < reviews.length; i++) {
          let isLong = reviews[i].text.length > maxLen;
          reviews[i].text = reviews[i].text.substring(0, maxLen) + (isLong ? "..." : "");
        }
        this.reviews = reviews;

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
    this.http.get(`${environment.apiUrl}/review-length/` + this.business.business_id).subscribe((result: any) => {
      console.log(result[0].review_id)
      this.totalSize = result[0].review_id
    });

    this.getAllReviews(this);

    if (this.toolbarService.subsVar == undefined) {
      this.toolbarService.subsVar = this.toolbarService.invokeOpenReviewDialog.subscribe((name: string) => {
        this.openReviewDialog();
      });
    }

    if (this.businessService.subsVar == undefined) {
      console.log('abc');
      this.businessService.subsVar = this.businessService.invokeReviewRefresh.subscribe(() => {
        console.log('def');
        this.getAllReviews(this);
      });
    }
  }

}
