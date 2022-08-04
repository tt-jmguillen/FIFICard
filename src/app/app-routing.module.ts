import { SignAndSendCardsComponent } from './sign-and-send-cards/sign-and-send-cards.component';
import { CartsComponent } from './carts/carts.component';
import { SignAndSendComponent } from './order/sign-and-send/sign-and-send.component';
import { FathersDayComponent } from './fathers-day/fathers-day.component';
import { MessageComponent } from './message/message.component';
import { MotherGiftsComponent } from './mothers-day/mother-gifts/mother-gifts.component';
import { MotherCardsComponent } from './mothers-day/mother-cards/mother-cards.component';
import { MothersDayComponent } from './mothers-day/mothers-day.component';
import { StickersComponent } from './stickers/stickers.component';
import { CreationsComponent } from './creations/creations.component';
import { GiftsComponent } from './gifts/gifts.component';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { StatusComponent } from './status/status.component';
import { OrderComponent } from './order/order.component';
import { DetailComponent } from './detail/detail.component';
import { CardsComponent } from './cards/cards.component';
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { MotherGreetingsComponent } from './mothers-day/mother-greetings/mother-greetings.component';
import { FatherGreetingsComponent } from './fathers-day/father-greetings/father-greetings.component';
import { SignAndSendPageComponent } from './sign-and-send-page/sign-and-send-page.component';
import { GraduationComponent } from './graduation/graduation.component';
import { GraduationGreetingsComponent } from './graduation/graduation-greetings/graduation-greetings.component';
import { JustBecauseComponent } from './just-because/just-because.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'mother', component: MothersDayComponent
  },
  {
    path: 'mother/cards', component: MotherCardsComponent
  },
  {
    path: 'mother/gifts', component: MotherGiftsComponent
  },
  {
    path: 'mother/greetings', component: MotherGreetingsComponent
  },
  {
    path: 'father', component: FathersDayComponent
  },
  {
    path: 'father/greetings', component: FatherGreetingsComponent
  },
  {
    path: 'tabs', component: TabsComponent
  },
  {
    path: 'profile/:id', component: ProfileComponent
  },
  {
    path: 'events', component: EventsComponent
  },
  {
    path: 'gifts', component: GiftsComponent
  },
  {
    path: 'creations', component: CreationsComponent
  },
  {
    path: 'stickers', component: StickersComponent
  },
  {
    path: 'signandsend', component: SignAndSendCardsComponent
  },
  {
    path: 'cards/events/:event', component: CardsComponent
  },
  {
    path: 'cards/events/:event/:recipient', component: CardsComponent
  },
  {
    path: 'search/:search', component: CardsComponent
  },
  {
    path: 'card/:id', component: DetailComponent
  },
  {
    path: 'order/:id', component: OrderComponent
  },
  {
    path: 'signandsend/:id', component: SignAndSendComponent
  },
  {
    path: 'status/:id', component: StatusComponent
  },
  {
    path: 'page/:id', component: PageComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'cart', component: CartsComponent
  },
  {
    path: 'signandsendpage', component: SignAndSendPageComponent
  },
  {
    path: 'graduation', component: GraduationComponent
  },
  {
    path: 'graduation/greetings', component: GraduationGreetingsComponent
  },
  {
    path: 'justbecause', component: JustBecauseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}



