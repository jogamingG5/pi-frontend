import { Routes } from '@angular/router';
import { MatchListComponent } from './pages/match-list/match-list.component';
import { MatchDetailComponent } from './pages/match-detail/match-detail.component';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { ClassementComponent } from './pages/classement-detail/classement.component';
import { StatistiquesComponent } from './pages/statistiques-detail/statistiques.component';
import { FeuillesDeMatchComponent } from './pages/feuillesdematch-detail/feuillesdematch.component';
import { MatchmakingComponent } from './pages/matchmaking/matchmaking.component';

export const routes: Routes = [
  { path: '', redirectTo: '/matches', pathMatch: 'full' },
  { path: 'matches', component: MatchListComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'statistiques', component: StatistiquesComponent },
  { path: 'classement', component: ClassementComponent },
  { path: 'feuillesdematch', component: FeuillesDeMatchComponent },
  { path: 'matchmaking', component: MatchmakingComponent },
  { path: '**', redirectTo: '/matches' } // Wildcard route
];
