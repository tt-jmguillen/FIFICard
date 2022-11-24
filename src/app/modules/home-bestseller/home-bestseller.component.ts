import { Component, Input, OnInit } from '@angular/core';
import { TransitionCheckState } from '@angular/material/checkbox';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-bestseller',
  templateUrl: './home-bestseller.component.html',
  styleUrls: ['./home-bestseller.component.scss']
})
export class HomeBestsellerComponent implements OnInit {
  @Input() caption: string = '';
  @Input() ids: string[] = [];

  service: CardService;
  bestsellerCards: Card[] = [];
  randomBestsellerCards: Card[] = [];
  temp: any;

  constructor(private _service: CardService) {
    this.service = _service;
  }

  ngOnInit(): void {
    if (this.ids.length == 0) {
      this.loadBestseller();
    }
    else {
      this.getCard(0);
    }
  }

  loadBestseller() {
    this.service.getBestsellerCards().then(data => {
      this.randomBestsellerCards = [];
      data.forEach(async card => {
        this.randomBestsellerCards.push(card);
        this.getImage(card);
      });
    });
  }

  getCard(count: number) {
    if (count < this.ids.length) {
      this.service.getACard(this.ids[count]).then(card => {
        this.randomBestsellerCards.push(card);
        this.getImage(card);
        this.getCard(count + 1);
      });
    }
  }

  getImage(card: Card) {
    this.service.getPrimaryImage(card.id!).then(image => {
      this.getAvailableURL(image).then(url => {
        this.randomBestsellerCards.forEach(value => {
          if (card.id == value.id) {
            card.imageUrl = url;
          }
        })
      });
    });
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        });
      });
    });
  }

}
