import { doc, Firestore, docData, collection, getDocsFromServer, query, where } from '@angular/fire/firestore';
import { Cardtype, TypeUpgrade } from './../models/cardtype';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  store: Firestore;

  constructor(
    _store: Firestore
  ) {
    this.store = _store;
  }

  getCardType(): Promise<Cardtype[]> {
    return new Promise((resolve) => {
      const col = collection(this.store, 'cardtype');
      getDocsFromServer(col).then(docs => {
        let types: Cardtype[] = [];
        docs.forEach(doc => {
          let type: Cardtype = doc.data() as Cardtype;
          type.id = doc.id;
          types.push(type);
        })
        resolve(types);
      })
    });
  }

  getUpgrade(): Promise<TypeUpgrade[]> {
    return new Promise((resolve, rejects) => {
      const col = collection(this.store, 'cardtypeupgrade');
      const q = query(col, where('active', "==", true))
      getDocsFromServer(col).then(docs => {
        let types: TypeUpgrade[] = [];
        docs.forEach(doc => {
          let type: TypeUpgrade = doc.data() as TypeUpgrade;
          type.id = doc.id;
          types.push(type);
        })
        resolve(types);
      })
    });
  }

  getMailSupport(): Promise<string>{
    return new Promise((resolve) => {
      const docs = doc(this.store, 'settings/mail');
      docData(docs).subscribe(value => {
        if (value) resolve( value['html']);
        else resolve("");
      });
    });
  }
}
