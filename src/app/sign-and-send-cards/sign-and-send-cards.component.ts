import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-sign-and-send-cards',
  templateUrl: './sign-and-send-cards.component.html',
  styleUrls: ['./sign-and-send-cards.component.scss']
})
export class SignAndSendCardsComponent implements OnInit {
  cardService: CardService;
  cards: Card[] = [];
  caption: string;
  loading: boolean;

  constructor(
    _cardService: CardService
  ) { 
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(){
    this.caption = "sign.title";
    this.loading = true;
    this.cardService.getSignAndSendCards().then(cards => {
      this.cards = cards;
      this.loading = false;
    }).catch(err => {
      this.caption = "sign.titleno";
      this.loading = false;
    })
  }
}
