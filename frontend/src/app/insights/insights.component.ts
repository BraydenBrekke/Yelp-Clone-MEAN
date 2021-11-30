import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {

  @ViewChild('mostUsefulReviewsChart') mostUsefulReviewsChart: ElementRef | any;

  public topBusinesses: any = [];
  public bestCities: any = [];
  public topUsers: any = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getTopBusinesses();
    this.getBestCities();
    this.getTopUsers();
  }

  getTopBusinesses() {
    this.http
      .get(`${environment.apiUrl}/top-businesses`)
      .subscribe((data: any) => this.topBusinesses = data ? data : []);
  }

  getBestCities() {
    this.http
      .get(`${environment.apiUrl}/best-cities`)
      .subscribe((data: any) => this.bestCities = data ? data : []);
  }

  getTopUsers() {
    this.http
      .get(`${environment.apiUrl}/top-users`)
      .subscribe((data: any) => this.topUsers = data ? data : []);
  }
}
