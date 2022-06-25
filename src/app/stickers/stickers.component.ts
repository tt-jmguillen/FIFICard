import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { captureRejectionSymbol } from 'events';
import { Card } from '../models/card';

@Component({
  selector: 'app-stickers',
  templateUrl: './stickers.component.html',
  styleUrls: ['./stickers.component.scss']
})
export class StickersComponent implements OnInit {
  service: EventService;
  cardService: CardService;
  cards: Card[] = [];
  loading: boolean;
  caption: string;

  constructor(
    private _service: EventService,
    private _cardService: CardService
  ) {
    this.service = _service;
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.loadStickers();
  }

  loadStickers() {
    this.service.getEventSticker().then((events: Event[]) => {
      if (events.length > 0){
        events.forEach(event => {
          this.loading = true;
          this.cardService.getCardsByEvent(event.name!).then(cards => {
            cards.forEach(card => {
              let index = this.cards.findIndex(x => x.id! == card.id!)
              if (index < 0) {
                this.cards.push(card);
              }
            })
            this.loading = false;
            if (this.cards.length == 0){
              this.caption = "No cards found";
            }
          })
        })
      }
      else{
        this.caption = "No cards found";
      }
    }).catch(err => {
      this.caption = "No cards found";
    })
  }
}
