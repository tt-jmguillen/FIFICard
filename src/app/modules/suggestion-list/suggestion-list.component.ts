import { SignAndSend } from './../../models/sign-and-send';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

class Batch {
  public cards: Card[];

  constructor() {
    this.cards = [];
  }
}

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.scss']
})
export class SuggestionListComponent implements OnInit {
  @Input() card: Card;

  service: CardService;
  batches: Batch[] = [];
  isMobile: boolean;

  constructor(
    private _service: CardService,
    private config: NgbCarouselConfig
  ) {
    this.service = _service;
    config.interval = 7000;
    config.wrap = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 500;
    this.getEventCard(this.card.events![0]);
  }

  getEventCard(event: string) {
    if (this.card.signAndSend!) {
      this.service.getSignAndSendSuggestions(event.trim(), 13).then(data => {
        this.loadBatch(data);
        this.getImages();
      });
    }
    else {
      this.service.getSuggestions(event.trim(), 13).then(data => {
        this.loadBatch(data);
        this.getImages();
      });
    }
  }

  getImages() {
    this.batches.forEach(batch => {
      batch.cards.forEach(card => {
        this.getImage(card);
      })
    })
  }

  getImage(card: Card) {
    if (card.type == 'ecard') {
      console.log(card)
      this.service.getECardImages(card.id!).then(images => {
        let preview = images.find(x => x.title == 'preview')!;
        this.getAvailableURL(preview.url).then(url => {
          card.imageUrl = url;
        });
      })
    } 
    else {
      this.service.getPrimaryImage(card.id!).then(image => {
        this.getAvailableURL(image).then(url => {
          card.imageUrl = url;
        });
      });
    }
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        }).catch(err => {
        })
      });
    });
  }

  loadBatch(list: Card[]) {
    let newList: Card[] = list;
    let index: number = newList.findIndex(x => x.id == this.card.id);
    if (index >= 0) {
      list.splice(index, 1);
    }
    newList = newList.splice(0, 12);

    this.batches = [];
    const displayCount = this.isMobile ? 3 : 6;
    let counter: number = 1;
    let cards: Card[] = []

    newList.forEach(card => {
      cards.push(card);
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
