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
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; 
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { OrderComponent } from './order/order.component';
import { ImagegridComponent } from './modules/imagegrid/imagegrid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusComponent } from './status/status.component';
import { CartComponent } from './modules/cart/cart.component';
import { MenuComponent } from './modules/menu/menu.component';
import { SearchComponent } from './modules/search/search.component';
import { PageComponent } from './page/page.component';
import { Safe } from './modules/safe';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { GiftsComponent } from './gifts/gifts.component';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { LoginComponent } from './login/login.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { FeedbackComponent } from './modules/feedback/feedback.component';
import { NgxFeedbackModule } from 'ngx-feedback';

@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    CardComponent,
    DetailComponent,
    OrderComponent,
    ImagegridComponent,
    StatusComponent,
    CartComponent,
    MenuComponent,
    SearchComponent,
    PageComponent,
    Safe,
    HomeComponent,
    EventsComponent,
    GiftsComponent,
    LoginComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
    NgxPayPalModule,
    NgxFeedbackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
