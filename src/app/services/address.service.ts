import { AddressConfig } from './../models/address-config';
import { Injectable } from '@angular/core';
import { Address } from '../models/address';
import { Firestore, addDoc, collection, doc, getDocFromServer, getDocsFromServer, orderBy, query, updateDoc } from '@angular/fire/firestore';

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
        'name': address.name?address.name:'',
        'firstname': address.firstname,
        'lastname': address.lastname,
        'address': address.address,
        'address2': address.address2?address.address2:'',
        'province': address.province?address.province:'',
        'city': address.city?address.city:'',
        'country': address.country?address.country:'',
        'postcode': address.postcode?address.postcode:''
      }).then(address => {
        resolve(address.id);
      })
    });
  }

  getAddress(id: string): Promise<Address>
  {
    return new Promise((resolve) => {
      getDocFromServer(doc(this.store, 'addresses/' + id)).then(doc => {
        let address: Address = doc.data() as Address;
        address.id = doc.id;
        resolve(address);
      })
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
      'address2': address.address2?address.address2:'',
      'province': address.province?address.province:'',
      'city': address.city?address.city:'',
      'country': address.country?address.country:'',
      'postcode': address.postcode?address.postcode:''
    });
  }

  getAddressConfig(): Promise<AddressConfig[]> {
    return new Promise((resolve, rejects) => {
      const col = collection(this.store, 'address_config');
      const q = query(col, orderBy("order", "asc"))
      getDocsFromServer(q).then(docs => {
        let addresses: AddressConfig[] = [];
        docs.forEach(doc => {
          let address: AddressConfig = doc.data() as AddressConfig;
          address.id = doc.id;
          addresses.push(address);
        })
        resolve(addresses);
      })
    });
  }
}