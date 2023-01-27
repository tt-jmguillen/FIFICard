import { Bundle } from './../models/bundle';
import { Card } from 'src/app/models/card';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  location: 'ph' | 'sg' | 'us' = 'ph';

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

  bundles = [
    { messagetype: 'regular', count: 6, price: 550, sgprice: 35.5, usprice: 40 },
    { messagetype: 'regular', count: 12, price: 950, sgprice: 65, usprice: 80 },
    { messagetype: 'poetry', count: 6, price: 700, sgprice: 40, usprice: 50 },
    { messagetype: 'poetry', count: 12, price: 1200, sgprice: 85, usprice: 100 }
  ]

  bundlespostcard = [
    { count: 100, price: 1500, sgprice: 48, usprice: 40 },
    { count: 250, price: 3000, sgprice: 102, usprice: 85 },
    { count: 500, price: 6000, sgprice: 192, usprice: 160 },
    { count: 12000, price: 6000, sgprice: 370, usprice: 310 }
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

  private getSignAndSend(type: 'message' | 'type', location: 'ph' | 'sg' | 'us') {
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

  getLocation(): 'ph' | 'sg' | 'us' {
    return this.location;
  }

  public getPrice(card: Card, type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED'): number {
    let value: number = 0;

    if (this.location == 'sg') {
      if (card.signAndSend!)
        value = card.sgprice != undefined ? card.sgprice! : this.getSignAndSend('message', this.location);
      else
        value = card.sgprice != undefined ? card.sgprice! : this.getDefault(type, card.messagetype, this.location);
    }
    else if (this.location == 'us') {
      if (card.signAndSend!)
        value = card.usprice != undefined ? card.usprice! : this.getSignAndSend('message', this.location);
      else
        value = card.usprice != undefined ? card.usprice! : this.getDefault(type, card.messagetype, this.location);
    }
    else if (this.location == 'ph') {
      if (card.signAndSend!)
        value = card.price != undefined ? card.price! : this.getSignAndSend('message', this.location);
      else
        value = card.price != undefined ? card.price! : this.getDefault(type, card.messagetype, this.location);
    }

    return value;
  }

  private getBundle(messagetype: 'regular' | 'poetry', count: number, location: 'ph' | 'sg' | 'us'): number {
    let value: number = 0;

    let bundles = this.bundles.filter(x => x.messagetype == messagetype && x.count == count);
    if (bundles.length > 0) {
      if (location == 'sg') {
        value = bundles[0].sgprice;
      }
      else if (location == 'us') {
        value = bundles[0].usprice;
      }
      else {
        value = bundles[0].price;
      }
    }

    return value;
  }

  private getBundlePostcard(count: number, location: 'ph' | 'sg' | 'us'): number {
    let value: number = 0;

    let bundles = this.bundlespostcard.filter(x => x.count == count);
    if (bundles.length > 0) {
      if (location == 'sg') {
        value = bundles[0].sgprice;
      }
      else if (location == 'us') {
        value = bundles[0].usprice;
      }
      else {
        value = bundles[0].price;
      }
    }

    return value;
  }

  public getBundlePrice(messagetype: 'regular' | 'poetry', bundle: Bundle): number {
    let value: number = 0;

    if (this.location == 'sg') {
      value = bundle.sgprice != undefined ? bundle.sgprice : this.getBundle(messagetype, bundle.count, this.location);
    }
    else if (this.location == 'us') {
      value = bundle.usprice != undefined ? bundle.usprice : this.getBundle(messagetype, bundle.count, this.location);
    }
    else if (this.location == 'ph') {
      value = bundle.price != undefined ? bundle.price : this.getBundle(messagetype, bundle.count, this.location);
    }

    return value;
  }

  public getPostcardBundlePrice(bundle: Bundle): number {
    let value: number = 0;

    if (this.location == 'sg') {
      value = bundle.sgprice != undefined ? bundle.sgprice : this.getBundlePostcard(bundle.count, this.location);
    }
    else if (this.location == 'us') {
      value = bundle.usprice != undefined ? bundle.usprice : this.getBundlePostcard(bundle.count, this.location);
    }
    else if (this.location == 'ph') {
      value = bundle.price != undefined ? bundle.price : this.getBundlePostcard(bundle.count, this.location);
    }

    return value;
  }
}
