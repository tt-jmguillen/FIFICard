import { EmailMessageComponent } from './email-message/email-message.component';
import { PoetryCardsComponent } from './poetry-cards/poetry-cards.component';
import { StickersCardsComponent } from './stickers-cards/stickers-cards.component';
import { PlayComponent } from './play/play.component';
import { ECardOrderComponent } from './ecard-order/ecard-order.component';
import { SamplePlayerComponent } from './sample/sample-player/sample-player.component';
import { SampleComponent } from './sample/sample.component';
import { PostcardsComponent } from './postcards/postcards.component';
import { PoetryComponent } from './poetry/poetry.component';
import { SignAndSendEventsComponent } from './sign-and-send-events/sign-and-send-events.component';
import { HalloweenGreetingsComponent } from './halloween/halloween-greetings/halloween-greetings.component';
import { HalloweenComponent } from './halloween/halloween.component';
import { ECardsPageComponent } from './e-cards-page/e-cards-page.component';
import { SpecialtyCardsPageComponent } from './specialty-cards-page/specialty-cards-page.component';
import { SignAndSendCardsComponent } from './sign-and-send-cards/sign-and-send-cards.component';
import { CartsComponent } from './carts/carts.component';
import { SignAndSendComponent } from './order/sign-and-send/sign-and-send.component';
import { FathersDayComponent } from './fathers-day/fathers-day.component';
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
import { FatherGreetingsComponent } from './fathers-day/father-greetings/father-greetings.component';
import { SignAndSendPageComponent } from './sign-and-send-page/sign-and-send-page.component';
import { GraduationComponent } from './graduation/graduation.component';
import { GraduationGreetingsComponent } from './graduation/graduation-greetings/graduation-greetings.component';
import { JustBecauseComponent } from './just-because/just-because.component';
import { JustBecauseGreetingsComponent } from './just-because/just-because-greetings/just-because-greetings.component';
import { ChristmasComponent } from './christmas/christmas.component';
import { ChristmasGreetingsComponent } from './christmas/christmas-greetings/christmas-greetings.component';
import { NewyearComponent } from './newyear/newyear.component';
import { NewyearGreetingsComponent } from './newyear/newyear-greetings/newyear-greetings.component';
import { ValentinesComponent } from './valentines/valentines.component';
import { ValentinesGreetingsComponent } from './valentines/valentines-greetings/valentines-greetings.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, title: "Fibei Greetings"
  },
  {
    path: 'home', component: HomeComponent, title: "Fibei Greetings"
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
    path: 'profile/:id', component: ProfileComponent, title: "User Profile"
  },
  {
    path: 'events', component: EventsComponent, title: "Events"
  },
  {
    path: 'gifts', component: GiftsComponent, title: "Gifts"
  },
  {
    path: 'creations', component: CreationsComponent
  },
  {
    path: 'stickers', component: StickersComponent, title: "Stickers"
  },
  {
    path: 'stickercards', component: StickersCardsComponent
  },
  {
    path: 'stickercards/:id', component: StickersCardsComponent
  },
  {
    path: 'signandsend', component: SignAndSendEventsComponent, title: 'Sign & Send'
  },
  {
    path: 'signandsendcards/:id', component: SignAndSendCardsComponent
  },
  {
    path: 'cards/events/:event', component: CardsComponent
  },
  {
    path: 'cards/events/:event/:recipient', component: CardsComponent
  },
  {
    path: 'cards/event/:id', component: CardsComponent
  },
  {
    path: 'cards/event/:id/:recipient', component: CardsComponent
  },
  {
    path: 'search/:search', component: CardsComponent, title: "Fibei Greetings"
  },
  {
    path: 'e-cards/events/:id', component: CardsComponent
  },
  {
    path: 'card/:id', component: DetailComponent
  },
  {
    path: 'order/:id', component: OrderComponent
  },
  {
    path: 'order/:id/:orderid', component: OrderComponent
  },
  {
    path: 'ecardorder/:id', component: ECardOrderComponent
  },
  {
    path: 'signandsend/:id', component: SignAndSendComponent
  },
  {
    path: 'status/:id', component: StatusComponent
  },
  {
    path: 'page/:id', component: PageComponent, title: "Fibei Greetings"
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'cart', component: CartsComponent, title: 'Cart'
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
  },
  {
    path: 'justbecause/greetings', component: JustBecauseGreetingsComponent
  },
  {
    path: 'specialtycardpage', component: SpecialtyCardsPageComponent, title: "Specialty"
  },
  {
    path: 'ecardspage', component: ECardsPageComponent
  },
  {
    path: 'halloween', component: HalloweenComponent
  },
  {
    path: 'halloween/greetings', component: HalloweenGreetingsComponent
  },
  {
    path: 'christmas', component: ChristmasComponent
  },
  {
    path: 'christmas/greetings', component: ChristmasGreetingsComponent
  },
  {
    path: 'poetry', component: PoetryComponent, title: 'Poetry'
  },
  {
    path: 'poetrycards/:id', component: PoetryCardsComponent
  },
  {
    path: 'newyear', component: NewyearComponent
  },
  {
    path: 'newyear/greetings', component: NewyearGreetingsComponent
  },
  {
    path: 'valentines', component: ValentinesComponent
  },
  {
    path: 'valentines/greetings', component: ValentinesGreetingsComponent
  },
  {
    path: 'postcards', component: PostcardsComponent, title: 'Postcards'
  },
  {
    path: 'e-cards', component: ECardsPageComponent, title: 'E-Cards'
  },
  {
    path: 'samples', component: SampleComponent
  },
  {
    path: 'player/:id', component: SamplePlayerComponent
  },
  {
    path: 'play/:id', component: PlayComponent
  },
  {
    path: 'playtrack/:id', component: PlayComponent
  },
  {
    path: 'email/:type/:id', component: EmailMessageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
  exports: [RouterModule]
})

export class AppRoutingModule { }



