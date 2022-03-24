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
import { TabEventsComponent } from './pages/tab-events/tab-events.component';
import { TabGiftsComponent } from './pages/tab-gifts/tab-gifts.component';
import { TabLoginComponent } from './pages/tab-login/tab-login.component';
import { TabCreationsComponent } from './pages/tab-creations/tab-creations.component';
import { TabStickersComponent } from './pages/tab-stickers/tab-stickers.component';
import { TabProfileComponent } from './pages/tab-profile/tab-profile.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'events', component: TabEventsComponent
      },
      {
        path: 'gifts', component: TabGiftsComponent
      },
      {
        path: 'login', component: TabLoginComponent
      },
      {
        path: 'profile', component: TabProfileComponent
      },
      {
        path: 'creations', component: TabCreationsComponent
      },
      {
        path: 'stickers', component: TabStickersComponent
      },
    ]
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
