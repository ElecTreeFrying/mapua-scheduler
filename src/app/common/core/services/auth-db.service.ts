import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthDbService {

  public users: AngularFirestoreCollection<any>

  constructor(
    private fire: AngularFirestore
  ) {
    this.users = fire.collection<any>('user-data');
  }
  
  createUser(data: any) {
    
    const obs = this.fire.collection('access-codes', (ref) => {
      return ref.where('key', '==', data.code)
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          doc.ref.update({ isTaken: true })
        })
      })
    ).subscribe(() => 0);
    
    return this.users.add(data).then(() => {
      setTimeout(() => obs.unsubscribe(), 2000);
    });
  }
  
  searchUserAssignment(user: any) {
    return this.fire.collection('user-data', (ref) => {
      return ref.where('email', '==', user.email)
        .where('password', '==', user.password)
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any) => doc[0].assignment)
    )
  }
  
  searchUserAssignmentByEmail(user: any) {
    return this.fire.collection('user-data', (ref) => {
      return ref.where('email', '==', user.email)
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any) => doc[0].assignment)
    )
  }
  
  enableNetwork() {
    return this.fire.firestore.enableNetwork();
  }
  
  disableNetwork() {
    return this.fire.firestore.disableNetwork();
  }
  
}
