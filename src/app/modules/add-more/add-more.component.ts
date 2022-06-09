import { EventService } from './../../services/event.service';
import { Card } from './../../models/card';
import { CardService } from 'src/app/services/card.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddMore } from 'src/app/models/add-more';

@Component({
  selector: 'app-add-more',
  templateUrl: './add-more.component.html',
  styleUrls: ['./add-more.component.scss']
})
export class AddMoreComponent implements OnInit {
  @Input() id?: string;
  @Input() recipients?: string[];
  @Input() limit: number;
  @Output() selectedChange:EventEmitter<AddMore[]> =new EventEmitter<AddMore[]>();

  service: CardService;
  eventService: EventService;

  cards: AddMore[] = []
  displayCards: AddMore[] = [];
  index: number;
  currentIndex: number;
  isPrev: boolean;
  isNext: boolean;
  selected: AddMore[] = [];

  constructor(
    _service: CardService,
    _eventService: EventService
  ) { 
    this.service = _service;
    this.eventService = _eventService;
  }

  ngOnInit(): void {
    this.getGiftEvents();
  }

  getGiftEvents(){
    this.eventService.getEventGift().then(events => {
      events.forEach(event => {
        this.getCardsByEvent(event.name!);
      });
    });
  }

  getCardsByEvent(event: string){
    this.service.getCardsByEvent(event).then(cards => {
      this.filterRecipient(cards);
    })
  }

  filterRecipient(_cards: Card[]){
    _cards.forEach(card => {
      if (card.id != this.id!){
        let isAdded: boolean = false;

        card.recipient!.split(",").forEach(recipient => {
          if (recipient.toLowerCase() == "all"){
            isAdded = true;
          }
          else{
            if (this.recipients!.indexOf(recipient) >= 0){
              isAdded = true;
            }
          }
        })

        if(isAdded){
          this.cards.push(new AddMore(card));
        }
      }
    });
    this.computeIndex();
    this.loadIndex(1);
  }

  computeIndex(){
    this.index = Math.floor(this.cards.length / this.limit);
    if ((this.cards.length % this.limit) > 0){
      this.index++;
    }
  }

  loadIndex(index: number){
    let start: number = (index * this.limit) - this.limit;
    this.displayCards = this.cards.slice(start, start + this.limit);
    this.isPrev = index != 1;
    this.isNext = this.index != index;
    this.currentIndex = index;
  }

  loadPrev(){
    this.loadIndex(this.currentIndex - 1);
  }

  loadNext(){
    this.loadIndex(this.currentIndex + 1);
  }

  addMoreChange(id: string, count: any){
    this.cards.forEach(card => {
      if (card.card.id == id){
        card.count = count;
        this.updateSelected(card);
      }
    });
  }

  updateSelected(addMore: AddMore){
    let isFound: boolean = false;

    if(this.selected.length > 0){
      this.selected.forEach(value => {
        if (value.card.id == addMore.card.id){
          isFound = true;
          value.count = addMore.count;
        }
      });
    }

    if (!isFound){
      let item = new AddMore(addMore.card);
      addMore.count = addMore.count;
      this.selected.push(addMore);
    }

    this.selectedChange.emit(this.selected);
  }
}
