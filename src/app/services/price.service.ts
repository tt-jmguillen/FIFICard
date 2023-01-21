import { Card } from 'src/app/models/card';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  location: string = 'ph';

  constructor() {
    if (window.location.hostname.toLowerCase() == 'us.fibeigreetings.com') {
      this.location = 'us'
    }
    else if (window.location.hostname.toLowerCase() == 'sg.fibeigreetings.com') {
      this.location = 'sg'
    }
    else {
      this.location = 'ph'
    }
  }

  defaults = [
    { type: "STANDARD", messagetype: 'regular', price: 99, sgprice: 6.5, usprice: 7.5 },
    { type: "GLITTERED", messagetype: 'regular', price: 118, sgprice: 7.5, usprice: 8.75 },
    { type: "EMBOSSED", messagetype: 'regular', price: 145, sgprice: 8.5, usprice: 9.5 },

    { type: "STANDARD", messagetype: 'poetry', price: 125, sgprice: 8, usprice: 9 },
    { type: "GLITTERED", messagetype: 'poetry', price: 140, sgprice: 9, usprice: 10 },
    { type: "EMBOSSED", messagetype: 'poetry', price: 165, sgprice: 10, usprice: 11.5 },
  ];

  signandsends = [
    { type: 'message', price: 125, sgprice: 8.45, usprice: 9.75 },
    { type: 'photo', price: 150, sgprice: 9.75, usprice: 11 }
  ]

  private getDefault(type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED', messagetype: 'regular' | 'poetry', location: 'ph' | 'sg' | 'us'): number {
    let value: number = 0;
    let defaults = this.defaults.filter(x => x.messagetype == messagetype && x.type == type);
    if (defaults.length > 0) {
      if (location == 'sg') {
        value = defaults[0].sgprice;
      }
      else if (location == 'us') {
        value = defaults[0].usprice;
      }
      else {
        value = defaults[0].price;
      }
    }
    return value;
  }

  getSignAndSend(type: 'message' | 'type', location: 'ph' | 'sg' | 'us') {
    let value: number = 0;
    let signandsend = this.signandsends.filter(x => x.type == type);
    if (signandsend.length > 0) {
      if (location == 'sg') {
        value = signandsend[0].sgprice;
      }
      else if (location == 'us') {
        value = signandsend[0].usprice;
      }
      else {
        value = signandsend[0].price;
      }
    }
    return value;
  }

  public getSign(): string {
    let value: string = '₱';
    if (this.location == 'sg') {
      value = 'S$'
    }
    else if (this.location == 'us') {
      value = '$'
    }
    return value;
  }

  public getPrice(card: Card, type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED'): number {
    let value: number = 0;

    if (this.location == 'sg') {
      if (card.signAndSend!)
        value = card.sgprice != undefined ? card.sgprice! : this.getSignAndSend('message', 'sg');
      else
        value = card.sgprice != undefined ? card.sgprice! : this.getDefault(type, card.messagetype, 'sg');
    }
    else if (this.location == 'us') {
      if (card.signAndSend!)
        value = card.usprice != undefined ? card.usprice! : this.getSignAndSend('message', 'us');
      else
        value = card.usprice != undefined ? card.usprice! : this.getDefault(type, card.messagetype, 'us');
    }
    else {
      if (card.signAndSend!)
        value = card.price != undefined ? card.price! : this.getSignAndSend('message', 'ph');
      else
        value = card.price != undefined ? card.price! : this.getDefault(type, card.messagetype, 'ph');
    }

    return value;
  }
}
