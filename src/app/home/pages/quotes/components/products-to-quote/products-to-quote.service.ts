import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { DbCollections } from '../../../../../constants/db-collections';
import { Observable } from 'rxjs';
import { IProductToQuote } from '../../../../../../interfaces/productToQuote.interface';
import { deleteDoc } from '@firebase/firestore';
import { BrowserStorageService } from '../../../../../browser-storage.service';
import { ITakenIntoAccount } from '../../../../../../interfaces/takenIntoAccount.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsToQuoteService {
  private _productsToQuoteRef: CollectionReference = collection(
    this._fireStore,
    DbCollections.productsToQuote
  );

  private _takenIntoAccountRef: CollectionReference = collection(
    this._fireStore,
    DbCollections.takenIntoAccount
  );

  constructor(
    private _fireStore: Firestore,
    public _storageSvc: BrowserStorageService
  ) {}

  registerProductToQuote(
    productToQuoteDTO: any
  ): Promise<DocumentReference<any, DocumentData>> {
    return addDoc(this._productsToQuoteRef, productToQuoteDTO);
  }

  getProductsToQuote(): Observable<Array<IProductToQuote>> {
    return collectionData(this._productsToQuoteRef, {
      idField: 'id',
    }) as Observable<Array<IProductToQuote>>;
  }

  getTakenIntoAccount(): Observable<Array<ITakenIntoAccount>> {
    return collectionData(this._takenIntoAccountRef, {
      idField: 'id',
    }) as Observable<Array<ITakenIntoAccount>>;
  }

  async editProductToQuote(
    productoToQuoteId: string,
    productToQuoteDTO: any
  ): Promise<void> {
    const _productToQuoteDocRef = doc(
      this._fireStore,
      DbCollections.productsToQuote,
      productoToQuoteId
    );
    return await setDoc(_productToQuoteDocRef, productToQuoteDTO);
  }

  async deleteProductToQuote(productoToQuoteId: string): Promise<void> {
    const _productToQuoteDocRef = doc(
      this._fireStore,
      DbCollections.productsToQuote,
      productoToQuoteId
    );
    return await deleteDoc(_productToQuoteDocRef);
  }
}
