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
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { MotherGreetingsComponent } from './mothers-day/mother-greetings/mother-greetings.component';

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
    path: 'cards/events/:event', component: CardsComponent
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
    path: 'status/:id', component: StatusComponent
  },
  {
    path: 'page/:id', component: PageComponent
  },
  {
    path: 'login', component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
