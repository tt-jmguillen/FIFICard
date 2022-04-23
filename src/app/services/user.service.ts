import { Injectable } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  store: Firestore;

  constructor(
    private _store: Firestore
  ) { 
    this.store = _store;
  }

  subscribeUser(uid: string): Observable<User>
  {
    const data = doc(this.store, 'users/' + uid);
    return docData(data, {idField: 'id'}) as Observable<User>;
  }

  getUser(uid: string): Promise<User>
  {
    return new Promise((resolve) => {
      const data = doc(this.store, 'users/' + uid);
      (docData(data, {idField: 'id'}) as Observable<User>).subscribe(user => {
        resolve(user);
      });
    });
  }

  updateUser(user: User)
  {
    const data = doc(this.store, 'users/' + user.id);
    updateDoc(data, {
      'firstname': user.firstname,
      'lastname': user.lastname,
      'displayName': user.displayName,
      'gender': user.gender,
      'birthday': user.birthday 
    });
  }

  updateAddress(userId: string, addressId: string)
  {
    const data = doc(this.store, 'users/' + userId);
    updateDoc(data, {
      'address': addressId
    });
  }
}
