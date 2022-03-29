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
import { RatingComponent } from './modules/rating/rating.component';
import { NgxFeedbackModule } from 'ngx-feedback';
import { CreationsComponent } from './creations/creations.component';
import { StickersComponent } from './stickers/stickers.component';
import { RatingDecimalComponent } from './modules/rating-decimal/rating-decimal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsComponent } from './pages/tabs/tabs.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TabEventsComponent } from './pages/tab-events/tab-events.component';
import { TabGiftsComponent } from './pages/tab-gifts/tab-gifts.component';
import { TabLoginComponent } from './pages/tab-login/tab-login.component';
import { TabCreationsComponent } from './pages/tab-creations/tab-creations.component';
import { TabStickersComponent } from './pages/tab-stickers/tab-stickers.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { TabProfileComponent } from './pages/tab-profile/tab-profile.component';
import { RatingSummaryComponent } from './modules/rating-summary/rating-summary.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { PreferencesComponent } from './settings/preferences/preferences.component';


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
    RatingComponent,
    CreationsComponent,
    StickersComponent,
    RatingDecimalComponent,
    TabsComponent,
    TabEventsComponent,
    TabGiftsComponent,
    TabLoginComponent,
    TabCreationsComponent,
    TabStickersComponent,
    ProfileComponent,
    TabProfileComponent,
    RatingSummaryComponent,
    PreferencesComponent
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
    MatDialogModule,
    MatProgressBarModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
    NgxPayPalModule,
    NgxFeedbackModule,
    NgbModule
  ],
  providers: [{
    provide: MatDialogRef,
    useValue: {}
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
