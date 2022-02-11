import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsComponent } from './cards/cards.component';
import { CardComponent } from './card/card.component';
import { environment } from '../environments/environment';
import { DetailComponent } from './detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'; 
import { MatGridListModule } from '@angular/material/grid-list';
import { OrderComponent } from './order/order.component';
import { ImagegridComponent } from './modules/imagegrid/imagegrid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    CardComponent,
    DetailComponent,
    OrderComponent,
    ImagegridComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
