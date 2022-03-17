import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'rxjs';
import { Rating } from 'src/app/models/rating';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() id2?: string;
  service: CardService;
  ratings: Rating[] = [];
  norecords: boolean;

  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {
      console.log("RATINGS");

      this.norecords = false;
      this.service.getRatings(this.id2!).then(data => {
        console.log(">>>>: " + JSON.stringify(data));
        if (data.length > 0){
          data.forEach(rating => {
            this.ratings.push(rating);
          });
        }

        console.log("ratings " + JSON.stringify(this.ratings));

        this.norecords = false;
      }).catch(reason => {
        console.log(reason);
        this.norecords = true;
      });
  
  }

}
