import { PriceService } from './../services/price.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postcards',
  templateUrl: './postcards.component.html',
  styleUrls: ['./postcards.component.scss']
})
export class PostcardsComponent implements OnInit {

  priceService: PriceService;

  constructor(
    _priceService: PriceService
  ) { 
    this.priceService = _priceService;
  }

  ngOnInit(): void {
  }

}
