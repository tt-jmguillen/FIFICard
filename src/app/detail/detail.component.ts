import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id?: string;
  card?: Card;
  activateRoute: ActivatedRoute;
  service: CardService;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _service: CardService
  ) { 
    this.activateRoute = _activateRoute;
    this.service = _service;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });
  }

  loadCard(){
    this._service.getCard(this.id!).subscribe(data => {
      this.card! = data;
    });
  }

}
