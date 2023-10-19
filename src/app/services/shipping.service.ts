import { Fee } from './../models/fee';
import { Injectable } from '@angular/core';
import { Firestore, collection, getDocsFromServer, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  store: Firestore;

  constructor(
    _store: Firestore
  ) { 
    this.store = _store;
  }

  getShippingFees(): Promise<Fee[]>{
    return new Promise((resolve, rejects) => {
      const col = collection(this.store, 'shippingfee');
      getDocsFromServer(col).then(docs => {
        let fees: Fee[] = [];
        docs.forEach(doc => {
          let fee: Fee = doc.data() as Fee;
          fee.id = doc.id;
          fees.push(fee);
        })
        resolve(fees);
      })
    });
  }

  getShippingFee(type: string): Promise<Fee> {
    return new Promise((resolve, rejects) => {
      const col = collection(this.store, 'shippingfee');
      const q = query(col, where('name', "==", type))
      getDocsFromServer(col).then(docs => {
        let fees: Fee[] = [];
        docs.forEach(doc => {
          let fee: Fee = doc.data() as Fee;
          fee.id = doc.id;
          fees.push(fee);
        })
        resolve(fees[0]!);
      })
    });
  }
}
