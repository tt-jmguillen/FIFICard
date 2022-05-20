import { SignAndSendDetails } from './../models/sign-and-send-details';
import { Injectable } from '@angular/core';
import { collection, Firestore, doc, addDoc, docData, query, where, collectionData } from '@angular/fire/firestore';
import { ref, Storage, uploadBytes, UploadResult } from '@angular/fire/storage';
import { Order } from '../models/order';
import { Timestamp } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { Status } from '../models/status';
import { deleteDoc } from 'firebase/firestore';

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
        proof: order.proof!,
        transaction_id: order.transaction_id!,
        payer_id: order.payer_id!,
        payer_email: order.payer_email!,
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

  addSignAndSend(orderId: string, sign: SignAndSendDetails){
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders/' + orderId + '/signandsend')
      addDoc(data, {
        image: sign.image,
        code: sign.code,
        top: sign.top,
        left: sign.left,
        width: sign.width,
        height: sign.height,
        limit: sign.limit,
        style: sign.style,
        text: sign.text,
        size: sign.size,
        alignment: sign.alignment
      }).then(docRef => {
        const data = docData(docRef, {idField: 'id'}) as Observable<SignAndSendDetails>;
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

  getSignAndSendData(userId: string, cardId: string): Promise<SignAndSendDetails[]>{
    return new Promise((resolve) => {
      let data = collection(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/signandsend') ;
      (collectionData(data, { idField: 'id' }) as Observable<SignAndSendDetails[]>).subscribe(
        signs => {
          resolve(signs);
        }
      );
    });
  }

  addSignAndSendData(userId: string, cardId: string, sign: SignAndSendDetails){
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/signandsend')
      addDoc(data, {
        image: sign.image,
        code: sign.code,
        top: sign.top,
        left: sign.left,
        width: sign.width,
        height: sign.height,
        limit: sign.limit,
        style: sign.style,
        text: sign.text,
        size: sign.size,
        alignment: sign.alignment
      }).then(docRef => {
        const data = docData(docRef, {idField: 'id'}) as Observable<SignAndSendDetails>;
        data.subscribe(doc => {
          resolve(doc);
        });
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  deleteSignAndSendData(userId: string, cardId: string, id: string){
    deleteDoc(doc(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/signandsend/' + id));
  }

  getOrderInProgress(userId: string, cardId: string): Promise<Order[]>{
    return new Promise((resolve) => {
      let data = collection(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/order') ;
      (collectionData(data, { idField: 'id' }) as Observable<Order[]>).subscribe(
        order => {
          resolve(order);
        }
      );
    });
  }

  addOrderInProgress(userId: string, cardId: string, order: Order){
    const data = collection(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/order')
    return new Promise((resolve, rejects) => {
      addDoc(data, {
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        sender_email: order.sender_email,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_email: order.receiver_email,
        address: order.address,
        anonymously: order.anonymously,
        sendto: order.sendto,
        message: order.message
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

  deleteOrderInProgressa(userId: string, cardId: string, id: string){
    deleteDoc(doc(this.store, 'workinprogress/' + userId + '/card/' + cardId + '/order/' + id));
  }
}
