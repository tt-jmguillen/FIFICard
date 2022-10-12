import { EventService } from './../../services/event.service';
import { Card } from './../../models/card';
import { CardService } from 'src/app/services/card.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddMore } from 'src/app/models/add-more';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

class Batch {
  public items: AddMore[]

  constructor() {
    this.items = [];
  }
}

@Component({
  selector: 'app-add-more',
  templateUrl: './add-more.component.html',
  styleUrls: ['./add-more.component.scss']
})
export class AddMoreComponent implements OnInit {
  @Input() id?: string;
  @Input() recipients?: string[];
  @Input() limit: number;
  @Output() selectedChange: EventEmitter<AddMore[]> = new EventEmitter<AddMore[]>();

  service: CardService;
  eventService: EventService;
  isMobile: boolean;
  cards: AddMore[] = []
  displayCards: AddMore[] = [];
  selected: AddMore[] = [];
  batches: Batch[] = [];

  index: number;
  currentIndex: number;
  isPrev: boolean;
  isNext: boolean;

  constructor(
    _service: CardService,
    _eventService: EventService,
    config: NgbCarouselConfig
  ) {
    this.service = _service;
    this.eventService = _eventService;
    config.interval = 0;
    config.wrap = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 500;
    this.getGiftEvents();
  }

  getGiftEvents() {
    this.eventService.getEventGift().then(events => {
      events.forEach(event => {
        this.getCardsByEvent(event.name!);
      });
    });
  }

  getCardsByEvent(event: string) {
    this.service.getCardsByEvent(event).then(cards => {
      this.filterRecipient(cards);
    })
  }

  filterRecipient(_cards: Card[]) {
    _cards.forEach(card => {
      if (card.id != this.id!) {
        let isAdded: boolean = false;

        card.recipient!.split(",").forEach(recipient => {
          if (recipient.toLowerCase() == "all") {
            isAdded = true;
          }
          else {
            if (this.recipients!.indexOf(recipient) >= 0) {
              isAdded = true;
            }
          }
        })

        if (isAdded) {
          this.cards.push(new AddMore(card));
        }
      }
    });
    this.cards = this.cards.sort(() => Math.random() - Math.random()).slice(0, 30);
    this.loadBatch();
  }

  loadBatch() {
    this.batches = [];
    let items: AddMore[] = [];
    let counter: number = 1;
    const displayCount: number = this.isMobile ? 3 : 6;

    this.cards.forEach(item => {
      items.push(item);
      if (counter == displayCount) {
        counter = 1;
        let batch: Batch = new Batch();
        batch.items = items;
        this.batches.push(batch);
        items = [];
      }
      else {
        counter++;
      }
    })

    if (items.length > 0) {
      let batch: Batch = new Batch();
      items.forEach(item => {
        batch.items.push(item);
      })
      this.batches.push(batch);
    }
  }

  addMoreChange(id: string, count: any) {
    this.cards.forEach(card => {
      if (card.card.id == id) {
        card.count = count;
        this.updateSelected(card);
      }
    });
  }

  updateSelected(addMore: AddMore) {
    let isFound: boolean = false;

    if (this.selected.length > 0) {
      this.selected.forEach(value => {
        if (value.card.id == addMore.card.id) {
          isFound = true;
          value.count = addMore.count;
        }
      });
    }

    if (!isFound) {
      let item = new AddMore(addMore.card);
      addMore.count = addMore.count;
      this.selected.push(addMore);
    }

    this.selectedChange.emit(this.selected);
  }
}
