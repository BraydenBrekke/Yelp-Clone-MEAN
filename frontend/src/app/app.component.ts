import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of businesses
  businesses: any[] = [];

  constructor(private http: HttpClient) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllBusinesses();
  }


  // Get all Businesses from the API
  getAllBusinesses() {
    this.http.get(`${this.API}/business`)
      .subscribe((business: any) => {
        this.businesses = business
      })
  }
}