import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "metal-glass-app", "appId": "1:245345690461:web:d2cafc25319188eeaebeb4", "databaseURL": "https://metal-glass-app-default-rtdb.firebaseio.com", "storageBucket": "metal-glass-app.appspot.com", "apiKey": "AIzaSyCig7VhCQi1bJAkiA1sAr4DScdAGoCdT3s", "authDomain": "metal-glass-app.firebaseapp.com", "messagingSenderId": "245345690461" }))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage())), provideNzI18n(es_ES), importProvidersFrom(FormsModule), importProvidersFrom(HttpClientModule), provideAnimations()]
};
