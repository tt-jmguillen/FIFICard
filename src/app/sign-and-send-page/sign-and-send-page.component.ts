import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card';
import { environment } from 'src/environments/environment';

class Batch {
  public cards: Card[];

  constructor() {
    this.cards = [];
  }
}

@Component({
  selector: 'app-sign-and-send-page',
  templateUrl: './sign-and-send-page.component.html',
  styleUrls: ['./sign-and-send-page.component.scss']
})
export class SignAndSendPageComponent implements OnInit {
  cardService: CardService;
  cards: Card[] = [];
  batches: Batch[] = [];
  isMobile: boolean;

  constructor(
    _cardService: CardService
  ) {
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 600;
    console.log(window.innerWidth);
    this.loadSignAndSend();
  }

  loadSignAndSend() {
    this.cardService.getSignAndSendFeaturedCards().then(data => {
      this.cards = [];
      let ctr = 1;
      data.forEach(card => {
        this.cards.push(card);
        this.getImage(card);
        ctr = ctr + 1;
      });
      this.loadBatch(1);
    })
  }

  getImage(card: Card) {
    this.getAvailableURL(card.primary!).then(url => {
      this.cards.forEach(value => {
        if (card.id == value.id) {
          card.imageUrl = url;
        }
      })
    });
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.cardService.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.cardService.getImageURL(image).then(url => {
          resolve(url);
        });
      });
    });
  }

  loadBatch(_index: number) {
    this.batches = [];
    const displayCount = this.isMobile ? 4 : 6;
    let counter: number = 1;
    let cards: Card[] = []

    this.cards.forEach(randomCard => {
      cards.push(randomCard);
      if (counter == displayCount) {
        counter = 1;
        let batch: Batch = new Batch();
        batch.cards = cards;
        this.batches.push(batch);
        cards = [];
      }
      else {
        counter++;
      }
    })

    if (cards.length > 0) {
      let batch: Batch = new Batch();
      cards.forEach(card => {
        batch.cards.push(card);
      })
      this.batches.push(batch);
    }
  }
}
