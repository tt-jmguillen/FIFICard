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

  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.service.getCard(this.id!).subscribe(val => {
      this.card = val;
      this.loadImage();
    });
  }

  loadImage(){
    if(this.card){
      if (this.card!.images){
        let image = this.card!.images[0];
        this.service.getImageURL(image).then(url => {
          this.imageURL = url;
        });
      }
    }
  }

}
