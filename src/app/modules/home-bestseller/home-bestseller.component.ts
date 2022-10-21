import { Component, OnInit } from '@angular/core';
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

  service: CardService;
  bestsellerCards: Card[] = [];
  randomBestsellerCards: Card[] = [];
  temp: any;

  constructor(private _service: CardService) {
    this.service = _service;
  }

  ngOnInit(): void {
    this.loadBestseller();
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
