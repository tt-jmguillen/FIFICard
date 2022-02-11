import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: Cart[];

  constructor() { }

  ngOnInit(): void {
    let jsonString: string = localStorage.getItem('cart')!;
    if (jsonString != null){
      this.carts = JSON.parse(jsonString) as Cart[];
    }
  }

}
