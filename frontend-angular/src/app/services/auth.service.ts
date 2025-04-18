import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: firebase.User | null = null;

  constructor(private afAuth: AngularFireAuth) {}

  loginWithGoogle(): Promise<any> {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<any> {
    return this.afAuth.signOut();
  }

  get currentUser$(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  get currentUser(): firebase.User | null {
    return this._user;
  }

  // 👇 Called at app startup

  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        this._user = user;

        resolve();
      });
    });
  }
}
