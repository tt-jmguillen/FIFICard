import { doc, Firestore, docData } from '@angular/fire/firestore';
import { Cardtype, TypeUpgrade } from './../models/cardtype';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  store: Firestore;
  db: AngularFirestore;

  constructor(
    private _store: Firestore,
    private _db: AngularFirestore
  ) {
    this.store = _store;
    this.db = _db;
  }

  getCardType(): Promise<Cardtype[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cardtype').get().subscribe(data => {
        if (!data.empty) {
          let types: Cardtype[] = [];
          data.forEach(doc => {
            let type: Cardtype = doc.data() as Cardtype;
            type.id = doc.id;
            types.push(type);
          });
          resolve(types);
        }
        else {
          rejects("No types found.");
        }
      });
    });
  }

  getUpgrade(): Promise<TypeUpgrade[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cardtypeupgrade', ref => ref
        .where('active', "==", true)).get().subscribe(data => {
          if (!data.empty) {
            let types: TypeUpgrade[] = [];
            data.forEach(doc => {
              let type: TypeUpgrade = doc.data() as TypeUpgrade;
              type.id = doc.id;
              types.push(type);
            });
            resolve(types);
          }
          else {
            rejects("No upgrade found.");
          }
        });
    });
  }

  getMailSupport(): Promise<string>{
    return new Promise((resolve) => {
      const docs = doc(this.store, 'settings/mail');
      docData(docs).subscribe(value => {
        resolve( value['html']);
      });
    });
  }
}
