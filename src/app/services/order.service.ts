import { SignAndSendDetails } from './../models/sign-and-send-details';
import { Injectable } from '@angular/core';
import { collection, Firestore, doc, addDoc, docData, query, where, collectionData, updateDoc } from '@angular/fire/firestore';
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
  
  async createOrder(order: Order): Promise<string>{
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
        user_id: order.user_id,
        card_id: order.card_id,
        card_price: order.card_price,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        sender_email: order.sender_email,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_email: order.receiver_email,
        address: order.address,
        address1: order.address1,
        address2: order.address2,
        province: order.province,
        city: order.city,
        country: order.country,
        postcode: order.postcode,
        anonymously: order.anonymously,
        sendto: order.sendto,
        message: order.message,
        withSignAndSend: order.withSignAndSend,
        isPaid: false,
        count: order.count,
        shipping_fee: order.shipping_fee,
        created: Timestamp.now()
      }).then(docRef => {
        resolve(docRef.id);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async createAddMore(order: Order): Promise<string>{
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
        parentOrder: order.parentOrder,
        user_id: order.user_id,
        card_id: order.card_id,
        card_price: order.card_price,
        isPaid: false,
        count: order.count,
        shipping_fee: order.shipping_fee,
        created: Timestamp.now()
      }).then(docRef => {
        resolve(docRef.id);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  getOrder(id: string): Promise<Order>{
    return new Promise((resolve) => {
      const data = doc(this.store, 'orders/' + id);
      (docData(data, {idField: 'id'}) as Observable<Order>).subscribe(order => {
        resolve(order);
      });
    });
  }

  subscribeOrder(id: string): Observable<Order>{
    const data = doc(this.store, 'orders/' + id);
    return docData(data, {idField: 'id'}) as Observable<Order>;
  }

  updatePaidOrder(id: string, paymentId: string){
    const data = doc(this.store, 'orders/' + id);
    updateDoc(data, {
      isPaid: true,
      paymentId: paymentId
    });
  }

  updatePaidOrders(ids: string[], paymentId: string){
    ids.forEach(id => {
      const data = doc(this.store, 'orders/' + id);
      updateDoc(data, {
        isPaid: true,
        paymentId: paymentId
      });
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

 
}
