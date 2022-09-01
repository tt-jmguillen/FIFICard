import { environment } from './../../environments/environment';
import { Card } from './../models/card';
import { Component, Input, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() id?: string;

  service: CardService;
  card?: Card;
  imageURL?: string;
  rateAve:  number;
  rateCount:  number;

  constructor(
    private _service: CardService
  ) { 
    this.service = _service
  }

  ngOnInit(): void {
    this.service.getCard(this.id!).subscribe(val => {
      this.card = val;
      this.loadImage();
    });

    this.rateAve = 4.5;
    this.rateCount = 99;
  }

  loadImage(){
    if(this.card){
      if (this.card.primary){
        this.getImage(this.card.primary)
      }
      else{
        if (this.card.images!.length > 0){
          this.getImage(this.card.images![0]);
        }
      }
    }
  }

  getImage(image: string){
    this.getAvailableURL(image).then(url => {
      this.imageURL = url;
    });
  }

  getAvailableURL(image: string): Promise<string>{
    return new Promise((resolve) => {
      this.service.getImageURL(image + environment.imageSize.xlarge).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image + environment.imageSize.large).then(url => {
          resolve(url);
        }).catch(err => {
          this.service.getImageURL(image).then(url => {
            resolve(url);
          }).catch(err => {});
        });
      });
    });
    
  }

}
