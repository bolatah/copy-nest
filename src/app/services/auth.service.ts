import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, map } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject$ = new BehaviorSubject<firebase.User | null>(null);
  public user$ = this.userSubject$.asObservable();

  constructor(private afAuth: AngularFireAuth) {
if (Capacitor.isNativePlatform()) {
    GoogleAuth.initialize();
  }

    this.initAuth();
  }

  private initAuth(): void {
    this.afAuth.authState.subscribe((user) => {
      this.userSubject$.next(user);
    });
  }

  async loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    if (Capacitor.isNativePlatform()) {
      try {
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication.idToken;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        return await firebase.auth().signInWithCredential(credential);
      } catch (err) {
        console.error('Google Login (mobile) failed', err);
        throw err;
      }
    } else {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        return await firebase.auth().signInWithPopup(provider);
      } catch (err) {
        console.error('Google Login (web) failed', err);
        throw err;
      }
    }
  }

  async logout(): Promise<void> {
    await firebase.auth().signOut();
    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.signOut();
    }
  }
}
