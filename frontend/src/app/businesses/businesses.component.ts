import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reviews',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.css']
})
export class BusinessesComponent implements OnInit {

  // Declare empty list of businesses
  businesses: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllBusinesses();
  }


  // Get all Businesses from the API
  getAllBusinesses() {
    this.http.get(`${environment.apiUrl}/business`)
      .subscribe((business: any) => {
        this.businesses = business;


        // Put in a better place
        if (this.businesses && this.businesses.length) {
          this.businesses.forEach(b => {
            b.stars = Math.round(b.stars);


            if (b.categories && b.categories.length) {
              const catArr = b.categories.split(',');

              for (let i = 0; i < catArr.length; i++) {
                catArr[i] = catArr[i].trim();
              }

              b.categories = catArr;
            }
          });
        }

        console.log(this.businesses);
      });
  }

  navigateToReview(business: any) {
    this.router.navigateByUrl('business/' + business.business_id, {state: business});
    localStorage.setItem('business', JSON.stringify(business));
  }

}
