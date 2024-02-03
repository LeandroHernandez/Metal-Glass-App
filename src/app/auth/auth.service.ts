import { Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { localStorageLabels } from '../constants/localStorageLabels';
import { BrowserStorageService } from '../browser-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _auth: Auth,
    private _storageSvc: BrowserStorageService
  ) {}

  isLoggedIn(): boolean {
    return this._storageSvc.get(localStorageLabels.accessToken) ? true : false;
  }

  setToken(token: any): void {
    return this._storageSvc.set(
      localStorageLabels.accessToken,
      JSON.stringify(token)
    );
  }

  removeToken(): void {
    // return this._storage.removeItem(localStorageLabels.accessToken);
    return this._storageSvc.remove(localStorageLabels.accessToken);
  }

  register({ email, password }: any): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this._auth, email, password);
  }

  login({ email, password }: any): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }
}
