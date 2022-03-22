import { Component, Input, OnInit } from '@angular/core';
import { Rating } from 'src/app/models/rating';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-rating-decimal',
  templateUrl: './rating-decimal.component.html',
  styleUrls: ['./rating-decimal.component.scss']
})
export class RatingDecimalComponent implements OnInit {
  @Input() cardId?: string;
  ratings: Rating[] = [];
  norecords: boolean;
  service: CardService;
  rateCount = 0;
  currentRate = 0;

  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {
    console.log("RATINGS");

    this.norecords = false;
    this.service.getRatings(this.cardId!).then(data => {
      console.log(">>>>: " + JSON.stringify(data));
      if (data.length > 0){
        data.forEach(rating => {
          this.ratings.push(rating);
          this.rateCount = this.rateCount + 1;
          this.currentRate = this.currentRate + rating.rate;
        });
        this.currentRate = this.currentRate / this.rateCount;
      }

      console.log("rateCount " + String(this.rateCount));
      console.log("currentRate " + String(this.currentRate));
      this.norecords = false;
    }).catch(reason => {
      console.log(reason);
      this.norecords = true;
    });

}

}
