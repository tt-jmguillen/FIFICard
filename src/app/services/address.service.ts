import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, collection, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  store: Firestore;

  constructor(
    private _store: Firestore
  ) { 
    this.store = _store;
  }

  createAddress(address: Address): Promise<string>{
    return new Promise((resolve) => {
      const col = collection(this.store, 'addresses');
      addDoc(col, {
        'userId': address.userId,
        'name': address.name,
        'firstname': address.firstname,
        'lastname': address.lastname,
        'address': address.address,
        'address2': address.address2,
        'city': address.city,
        'province': address.province,
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
      'name': address.name,
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
}
