import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationsComponent } from 'src/app/creations/creations.component';
import { EventsComponent } from 'src/app/events/events.component';
import { GiftsComponent } from 'src/app/gifts/gifts.component';
import { LoginComponent } from 'src/app/login/login.component';
import { StickersComponent } from 'src/app/stickers/stickers.component';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'events', component: EventsComponent
      },
      {
        path: 'gifts', component: GiftsComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'creations', component: CreationsComponent
      },
      {
        path: 'stickers', component: StickersComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}