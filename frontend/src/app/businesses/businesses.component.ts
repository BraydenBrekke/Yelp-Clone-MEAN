import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-reviews',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.css'],
})
export class BusinessesComponent implements OnInit {
  public pageSize = 10;
  public currentPage = 0;
  public totalSize=0;
  // Declare empty list of businesses
  businesses: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.http.get(`${environment.apiUrl}/business-length`).subscribe((result: any)=>{
      this.totalSize=result
    });
    this.getAllBusinesses(this);
  }

  // Get all Businesses from the API
  getAllBusinesses(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.http
      .get(`${environment.apiUrl}/business?page=` + this.currentPage + '&limit=' + this.pageSize )
      .subscribe((business: any) => {
        this.businesses = business;
        // Put in a better place
        if (this.businesses && this.businesses.length) {
          this.businesses.forEach((b) => {
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
      });
  }

  /*
  addBusiness(businessForm: any) {
    const businessSchema: any = {
      address: "",
      attributes: {
        BusinessAcceptsCreditCards: null,
        ByAppointmentOnly: null,
        GoodForKids: null,
      },
      BusinessAcceptsCreditCards: null,
      ByAppointmentOnly: null,
      GoodForKids: null,
      RestaurantsPriceRange2: null,
      business_id: "",
      categories: "",
      city: "",
      hours: null,
      is_open: null,
      latitude: null,
      longitude: null,
      name: "",
      postal_code: "",
      review_count: 0,
      stars: 0
    };

    const bus = Object.assign({}, businessSchema, businessForm);
    console.log(bus);
  }
  */

  navigateToReview(business: any) {
    this.router.navigateByUrl('business/' + business.business_id, {
      state: business,
    });
    localStorage.setItem('business', JSON.stringify(business));
  }
}
