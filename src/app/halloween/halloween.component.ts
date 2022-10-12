import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card';

@Component({
  selector: 'app-halloween',
  templateUrl: './halloween.component.html',
  styleUrls: ['./halloween.component.scss']
})
export class HalloweenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
