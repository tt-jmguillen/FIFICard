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
import { MatCardModule } from '@angular/material/card';
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
import { ProfileComponent } from './settings/profile/profile.component';
import { RatingSummaryComponent } from './modules/rating-summary/rating-summary.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { PreferencesComponent } from './settings/preferences/preferences.component';
import { SuggestionListComponent } from './modules/suggestion-list/suggestion-list.component';
import { ReviewComponent } from './modules/review/review.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ProfileInfoComponent } from './settings/profile/profile-info/profile-info.component';
import { ProfileShippingAddressComponent } from './settings/profile/profile-shipping-address/profile-shipping-address.component';
import { ProfileChangePasswordComponent } from './settings/profile/profile-change-password/profile-change-password.component';
import { ProfileCommunicationComponent } from './settings/profile/profile-communication/profile-communication.component';
import { MothersDayComponent } from './mothers-day/mothers-day.component';
import { MotherCardsComponent } from './mothers-day/mother-cards/mother-cards.component';
import { MotherGiftsComponent } from './mothers-day/mother-gifts/mother-gifts.component';
import { MotherGreetingsComponent } from './mothers-day/mother-greetings/mother-greetings.component';
import { ProfileOrdersComponent } from './settings/profile/profile-orders/profile-orders.component';
import { FavoriteComponent } from './modules/favorite/favorite.component';
import { ProfileListComponent } from './settings/profile/profile-list/profile-list.component';
import { SubHeaderComponent } from './pages/sub-header/sub-header.component';
import { SubFooterComponent } from './pages/sub-footer/sub-footer.component';
import { MessageComponent } from './message/message.component';
import { FathersDayComponent } from './fathers-day/fathers-day.component';


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
    ProfileComponent,
    RatingSummaryComponent,
    PreferencesComponent,
    SuggestionListComponent,
    ReviewComponent,
    HeaderComponent,
    FooterComponent,
    ProfileInfoComponent,
    ProfileShippingAddressComponent,
    ProfileChangePasswordComponent,
    ProfileCommunicationComponent,
    MothersDayComponent,
    MotherCardsComponent,
    MotherGiftsComponent,
    MotherGreetingsComponent,
    ProfileOrdersComponent,
    FavoriteComponent,
    ProfileListComponent,
    SubHeaderComponent,
    SubFooterComponent,
    MessageComponent,
    FathersDayComponent,
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
    MatFormFieldModule,
    MatInputModule,
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
