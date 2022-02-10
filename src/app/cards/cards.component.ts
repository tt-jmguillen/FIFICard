import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  service: CardService;

  cards: Card[] = [];

  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.service.getCards().subscribe(data => {
      this.cards = data;
      console.log(this.cards);
    });
  }

}
