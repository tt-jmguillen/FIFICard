import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  event?: string;
  search?: string;

  caption: string = ''
  service: CardService;
  activateRoute: ActivatedRoute;

  cards: Card[] = [];

  constructor(
    private _service: CardService,
    private _activateRoute: ActivatedRoute) { 
    this.service = _service;
    this.activateRoute = _activateRoute;
  }

  ngOnInit(): void {
    console.log(this.activateRoute.params);
    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];

      if(this.event){
        if (this.event! != 'All'){
          this.caption! = this.event;
          this.loadEvent(this.event);
        }
        else{
          this.loadAll();
        }
      }
      else if(this.search){
        this.caption! = "Search: " + this.search;
        this.loadSearch(this.search);
      }
      else{
        this.loadAll();
      }
    });

    
  }

  loadAll(){
    this.service.getCards().then(data => {
      this.cards = data;
    });
  }

  loadEvent(_event: string){
    this.service.getCards().then(data => {
      data.forEach(card => {
        if (card.event){
          card.event.split(",").forEach(event => {
            if (event.trim() == _event){
              this.cards.push(card);
            }
          })
        }
      });
    });
  }

  loadSearch(_search: string){
    this.service.getCards().then(data => {
      data.forEach(card => {
        if (card.name!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.description!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.event!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.recipient!.includes(_search)){
          this.cards.push(card);
        }
      });
    });
  }

}
