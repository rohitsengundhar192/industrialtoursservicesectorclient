import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchScreenAppComponent } from './launch-screen-app/launch-screen-app.component';
import { GuidelinesComponent } from './Industrial-Service-Sector-Tours/guidelines/guidelines.component';
import { TourSitesComponent } from './Industrial-Service-Sector-Tours/tour-sites/tour-sites.component';
import { ParticipationCertificateComponent } from './Industrial-Service-Sector-Tours/participation-certificate/participation-certificate.component';
import { WavierFormComponent } from './Industrial-Service-Sector-Tours/wavier-form/wavier-form.component';
import { ScheduleToursAndBookTicketsComponent } from './Components/schedule-tours-and-book-tickets/schedule-tours-and-book-tickets.component';
import { ValidateCompleteTourComponent } from './Components/validate-complete-tour/validate-complete-tour.component';
import { BookIndustrialTourTicketComponent } from './Components/book-industrial-tour-ticket/book-industrial-tour-ticket.component';
import { TestingComponent } from './Industrial-Service-Sector-Tours/testing/testing.component';
import { ImageSliderComponent } from './Industrial-Service-Sector-Tours/image-slider/image-slider.component';

const routes: Routes = [
  { path: '', redirectTo: 'launch-screen', pathMatch: 'full' },
  {
    path: 'launch-screen',
    component: LaunchScreenAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'guidelines',
        pathMatch: 'full',
      },
      {
        path: 'guidelines',
        component: GuidelinesComponent,
      },
      {
        path: 'tour-sites',
        component: TourSitesComponent,
      },
      {
        path: 'participation-certificate',
        component: ParticipationCertificateComponent,
      },
      {
        path: 'wavier-form',
        component: WavierFormComponent,
      },
      {
        path: 'book-industrial-tour-ticket',
        component: BookIndustrialTourTicketComponent,
      },
      {
        path: 'schedule-tours-and-book-tickets',
        component: ScheduleToursAndBookTicketsComponent,
      },
      {
        path: 'validate-complete-tour',
        component: ValidateCompleteTourComponent,
      },
      {
        path: 'testing',
        component: TestingComponent,
      },
      {
        path: 'image-slider',
        component: ImageSliderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchScreenAppRoutingModule {}
