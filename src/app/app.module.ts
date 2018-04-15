import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OptionsPage } from '../pages/options/options';
import { NewEditCarPage } from '../pages/new-edit-car/new-edit-car';

// Other imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Providers
import { SmssProvider } from '../providers/smss/smss';
import { DbProvider } from '../providers/db/db';

// Storage
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

// Android
import { SMS } from '@ionic-native/sms';
import { AppProvider } from '../providers/app/app';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OptionsPage,
    NewEditCarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OptionsPage,
    NewEditCarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppProvider,
    ScreenOrientation,
    SMS,
    SmssProvider,
    SQLite,
    Toast,
    DbProvider,
    Diagnostic
  ]
})
export class AppModule { }
