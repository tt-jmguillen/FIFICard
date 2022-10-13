import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {

  constructor() { }

  mode: 'Category' | 'Recipient' | 'Event' = 'Category';

  ngOnInit(): void {
  }

  modeChange(mode: 'Category' | 'Recipient' | 'Event') {
    this.mode = mode;
  }
}
