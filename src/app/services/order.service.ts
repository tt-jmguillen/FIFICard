import { Injectable } from '@angular/core';
import { collection, Firestore, doc, addDoc, docData, query, where, collectionData } from '@angular/fire/firestore';
import { ref, Storage, uploadBytes, UploadResult } from '@angular/fire/storage';
import { Order } from '../models/order';
import { Timestamp } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  storage: Storage;
  store: Firestore;

  constructor(
    private _storage: Storage,
    private _store: Firestore
  ) { 
    this.storage = _storage;
    this.store = _store;
  }

  subscribeOrder(id: string): Observable<Order>{
    const data = doc(this.store, 'orders/' + id);
    return docData(data, {idField: 'id'}) as Observable<Order>;
  }

  getOrder(id: string): Promise<Order>{
    return new Promise((resolve) => {
      const data = doc(this.store, 'orders/' + id);
      (docData(data, {idField: 'id'}) as Observable<Order>).subscribe(order => {
        resolve(order);
      });
    });
  }

  getRandomString(): string {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 20; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  uploadFile(file: File): Promise<UploadResult>{
    let id = this.getRandomString();
    const reference = ref(this.storage, 'orders/' + id);
    return uploadBytes(reference, file);
  }

  async createOrder(order: Order): Promise<Order>{
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
        user_id: order.user_id,
        card_id: order.card_id,
        card_name: order.card_name,
        card_price: order.card_price,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        sender_email: order.sender_email,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_email: order.receiver_email,
        address: order.address,
        anonymously: order.anonymously,
        sendto: order.sendto,
        message: order.message,
        gateway: order.gateway,
        proof: order.proof,
        transaction_id: order.transaction_id,
        payer_id: order.payer_id,
        payer_email: order.payer_email,
        status: order.status,
        created: Timestamp.now()
      }).then(docRef => {
        const data = docData(docRef, {idField: 'id'}) as Observable<Order>;
        data.subscribe(doc => {
          resolve(doc);
        });
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async getInitial(): Promise<string>{
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'status');
      let qry = query(data, where('initial', "==", true));
      let colData = collectionData(qry, { idField: 'id' }) as Observable<Status[]>;
      colData.subscribe(statuses => {
        if (statuses.length > 0)
          resolve(statuses[0].name);
        else
          resolve("New");
      });
    });
  }
}
