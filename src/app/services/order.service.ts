import { Injectable } from '@angular/core';
import { collection, Firestore, doc, addDoc, docData } from '@angular/fire/firestore';
import { ref, Storage, uploadBytes, UploadResult } from '@angular/fire/storage';
import { Order } from '../models/order';
import { Timestamp } from "@angular/fire/firestore";
import { Observable } from 'rxjs';

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

  getOrder(id: string): Observable<Order>{
    const data = doc(this.store, 'orders/' + id);
    return docData(data, {idField: 'id'}) as Observable<Order>;
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

  async createOrder(order: Order): Promise<string>{
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
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
        proof: order.proof,
        status: order.status,
        created: Timestamp.now()
      }).then(docRef => {
        const data = docData(docRef, {idField: 'id'}) as Observable<Order>;
        data.subscribe(doc => {
          resolve(doc.id!);
        });
      }).catch(reason => {
        rejects(reason);
      })
    });
  }
}
