import { Fee } from './../models/fee';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  db: AngularFirestore;

  constructor(
    private _db: AngularFirestore
  ) { 
    this.db = _db;
  }

  getShippingFees(): Promise<Fee[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('shippingfee').get().subscribe(data => {
        if (!data.empty) {
          let fees: Fee[] = []
          data.forEach(doc => {
            let fee: Fee = doc.data() as Fee;
            fee.id = doc.id;
            fees.push(fee);
          });
          resolve(fees);
        }
        else {
          rejects("No shipping fees found.");
        }
      });
    });
  }

  getShippingFee(type: string): Promise<Fee> {
    return new Promise((resolve, rejects) => {
      this.db.collection('shippingfee', ref => ref
        .where('name', "==", type)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(doc => {
            let fee: Fee = doc.data() as Fee;
            fee.id = doc.id;
            resolve(fee);
          });
        }
        else {
          rejects("No shipping fees found.");
        }
      });
    });
  }
}
