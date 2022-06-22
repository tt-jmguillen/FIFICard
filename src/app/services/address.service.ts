import { AddressConfig } from './../models/address-config';
import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, collection, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  store: Firestore;
  db: AngularFirestore;

  constructor(
    private _store: Firestore,
    private _db: AngularFirestore
  ) { 
    this.store = _store;
    this.db = _db;
  }

  createAddress(address: Address): Promise<string>{
    return new Promise((resolve) => {
      const col = collection(this.store, 'addresses');
      addDoc(col, {
        'userId': address.userId,
        'name': address.name?address.name:'',
        'firstname': address.firstname,
        'lastname': address.lastname,
        'address': address.address,
        'address2': address.address2,
        'province': address.province,
        'city': address.city,
        'country': address.country,
        'postcode': address.postcode
      }).then(address => {
        resolve(address.id);
      })
    });
  }

  getAddress(id: string): Promise<Address>
  {
    return new Promise((resolve) => {
      const data = doc(this.store, 'addresses/' + id);
      (docData(data, {idField: 'id'}) as Observable<Address>).subscribe(address => {
        resolve(address);
      });
    });
  }
  
  updateAddress(address: Address)
  {
    const data = doc(this.store, 'addresses/' + address.id);
    updateDoc(data, {
      'name': address.name?address.name:'',
      'firstname': address.firstname,
      'lastname': address.lastname,
      'address': address.address,
      'address2': address.address2,
      'city': address.city,
      'province': address.province,
      'country': address.country,
      'postcode': address.postcode
    });
  }

  getAddressConfig(): Promise<AddressConfig[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('address_config', ref => ref.orderBy("order", "asc")).get().subscribe(data => {
        if (!data.empty) {
          let addresses: AddressConfig[] = [];
          data.forEach(doc => {
            let address: AddressConfig = doc.data() as AddressConfig;
            address.id = doc.id;
            addresses.push(address);
          });
          resolve(addresses);
        }
        else {
          rejects("No address config found.");
        }
      });
    });
  }
}