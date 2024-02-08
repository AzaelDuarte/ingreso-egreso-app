import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore) { }

  initAuthListener():any {
    return this.auth.beforeAuthStateChanged(user => {
      console.log(user);
    });
  }

  crearUsuario(nombre:string, email:string, password:string):Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
          .then(({ user }) => {
            const newUser = new Usuario(user.uid, nombre, user.email);
            
            const collectionRef = collection(this.firestore, `${user.uid}`);
            return addDoc(collectionRef, {...newUser});
            // const documentRef = doc(collectionRef, 'user');
            // setDoc(documentRef, newUser);
          }); 
  }

  loginUsuario(email:string, password:string): Promise<any> {
    return signInWithEmailAndPassword (this.auth, email, password);
  }

  loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logOut() {
    return signOut(this.auth);
  }

  isAuth():Observable<boolean> {
    return new Observable(subscriber => {
      const unsubscribe = this.auth.onAuthStateChanged(subscriber);
      return { unsubscribe };
    })
    .pipe(
      (map((fbUser) => fbUser !== null))
    );
  }
}
