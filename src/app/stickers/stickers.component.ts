import { Title } from '@angular/platform-browser';
import { title } from 'process';
import { CardService } from './../services/card.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  title: Title;
  service: EventService;
  cardService: CardService;
  def: ChangeDetectorRef;

  constructor(
    private _title: Title,
    private _service: EventService,
    private _cardService: CardService,
    private _def: ChangeDetectorRef
  ) {
    this.title = _title;
    this.service = _service;
    this.cardService = _cardService;
    this.def = _def;
  }

  cards: Card[] = [];
  filtered: Card[] = [];
  loading: boolean;
  caption: string;
  events: Event[] = [];
  eventName: string = 'All';

  ngOnInit(): void {
    this.title.setTitle("Stickers");
    this.loadStickers();
  }

  loadStickers() {
    this.service.getEventSticker().then((events: Event[]) => {
      this.events = events;
    }).catch(err => {
      this.caption = "No cards found";
    })

    this.loading = true;
    this.cardService.getCardsByType('sticker').then(cards => {
      this.cards = cards;
      this.filtered = this.cards;
      this.def.detectChanges();
      this.loading = false;

      if (this.cards.length == 0) {
        this.caption = "No sticker found";
      }
    })
  }

  clickEvent(eventName: string) {
    this.eventName = eventName;
    this.filtered = [];
    if (eventName == 'All') {
      this.filtered = this.cards;
      this.def.detectChanges();
    }
    else {
      this.cards.forEach(card => {
        if (card.events) {
          if (card.events.findIndex(x => x == eventName) >= 0) {
            this.filtered.push(card);
            this.def.detectChanges();
          }
        }
      })
    }
    document.getElementById("data-top")!.scrollIntoView();
  }
}
