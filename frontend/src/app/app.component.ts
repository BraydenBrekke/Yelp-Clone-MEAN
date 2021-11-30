import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {ToolbarService} from "./toolbar.service";


enum slug {
  BUSINESSES,
  BUSINESS
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  addBtnTxt: string = '';
  currentSlug: any;
 

  constructor(private router: Router,  private toolbarService: ToolbarService) {
  }

  morphButton() {
    if (this.currentSlug === slug.BUSINESS) {
      this.addBtnTxt = 'Review';
    } else {
      this.addBtnTxt = 'Business';
    }
  }

  buttonAction() {
    if (this.currentSlug === slug.BUSINESS) {
      this.toolbarService.openReviewDialog();
    } else {
      console.log('NEW BUSINESS');
    }
  }
  


  navigateToRoot() {
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          if (event.url.includes('business')) {
            this.currentSlug = slug.BUSINESS;
          } else {
            this.currentSlug = slug.BUSINESSES;
          }

          this.morphButton();
        }
      }
    );
  }
}
