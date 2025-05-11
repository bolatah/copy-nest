import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject$ = new BehaviorSubject<firebase.User | null>(null);
  public user$ = this.userSubject$.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.initAuth()
  }

  loginWithGoogle(): Promise<any> {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<any> {
    this.userSubject$.next(null);
    return this.afAuth.signOut();
  }

  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        this.userSubject$.next(user);
        resolve();
      });
    });
  }
}
