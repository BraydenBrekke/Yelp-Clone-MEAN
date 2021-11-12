import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-review',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  business: any;
  reviews: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
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

  ngOnInit() {
    this.getAllReviews();
  }

}
