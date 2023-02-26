import { PriceService } from './../services/price.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postcards',
  templateUrl: './postcards.component.html',
  styleUrls: ['./postcards.component.scss']
})
export class PostcardsComponent implements OnInit {

  title: Title;
  priceService: PriceService;

  constructor(
    _title: Title,
    _priceService: PriceService
  ) { 
    this.title = _title;
    this.priceService = _priceService;
  }

  ngOnInit(): void {
    this.title.setTitle("Postcards");
  }

}
