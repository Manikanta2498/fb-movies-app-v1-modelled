import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExitComponent } from './exit/exit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { PreconnectComponent } from './preconnect/preconnect.component';
import { SurveyComponent } from './survey/survey.component';
import { ThanksComponent } from './thanks/thanks.component';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full'},
  { path: '', component: HomeComponent },
  { path: 'info', component: InfoComponent },
  { path: 'exit', component: ExitComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'preconnect', component: PreconnectComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'thanks', component: ThanksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
