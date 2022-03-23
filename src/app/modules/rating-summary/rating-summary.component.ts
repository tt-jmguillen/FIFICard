import { Component, Input, OnInit } from '@angular/core';
import { Rating } from 'src/app/models/rating';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss']
})
export class RatingSummaryComponent implements OnInit {
  @Input() cardId?: string;
  ratings: Rating[] = [];
  norecords: boolean;
  service: CardService;
  rateCount = 0;
  currentRate = 0;
  currentRateStr = "0.0";
  rate1 = 0;
  rate2 = 0;
  rate3 = 0;
  rate4 = 0;
  rate5 = 0;
  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.norecords = true;
    this.service.getRatings(this.cardId!).then(data => {
      //console.log(">>>>: " + JSON.stringify(data));
      if (data.length > 0){
        data.forEach(rating => {
          if(rating.approve){
          this.norecords = false;
          this.ratings.push(rating);
          this.rateCount = this.rateCount + 1;
          this.currentRate = this.currentRate + rating.rate;

              switch (rating.rate) {
                case 1:
                    this.rate1+=1;
                    break;
                case 2:
                    this.rate2+=1;
                    break;
                case 3:
                    this.rate3+=1;
                    break;
                case 4:
                    this.rate4+=1;
                    break;
                default: 
                    this.rate5+=1;
                    break;
            }
          }
        });
        this.currentRate = this.currentRate / this.rateCount;
        this.currentRateStr = String(this.currentRate.toFixed(1));
      }
    }).catch(reason => {
      console.log(reason);
      this.norecords = true;
    });

  }

  calculateRate(rate: number): number{
    console.log("rate>>>>: " + String(rate));
    console.log("this.rateCount>>>>: " + String(this.rateCount));
    console.log("calculateRate: " + String((rate/this.rateCount)*100));
     return (rate/this.rateCount)*100;
  }

}
