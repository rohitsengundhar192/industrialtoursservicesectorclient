import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchScreenAppRoutingModule } from './launch-screen-app-routing.module';
import { LaunchScreenAppComponent } from './launch-screen-app/launch-screen-app.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleToursAndBookTicketsComponent } from './Components/schedule-tours-and-book-tickets/schedule-tours-and-book-tickets.component';
import { ValidateCompleteTourComponent } from './Components/validate-complete-tour/validate-complete-tour.component';
import { GuidelinesComponent } from './Industrial-Service-Sector-Tours/guidelines/guidelines.component';
import { TourSitesComponent } from './Industrial-Service-Sector-Tours/tour-sites/tour-sites.component';
import { ParticipationCertificateComponent } from './Industrial-Service-Sector-Tours/participation-certificate/participation-certificate.component';
import { WavierFormComponent } from './Industrial-Service-Sector-Tours/wavier-form/wavier-form.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DownloadFormsComponent } from './Industrial-Service-Sector-Tours/wavier-form/download-forms/download-forms.component';
import { UploadFormComponent } from './Industrial-Service-Sector-Tours/wavier-form/upload-form/upload-form.component';
import { ViewPdfComponent } from './Industrial-Service-Sector-Tours/wavier-form/view-pdf/view-pdf.component';
import { AddParticipantsComponent } from './Industrial-Service-Sector-Tours/wavier-form/popup/add-participants/add-participants.component';
import { EditParticipantsComponent } from './Industrial-Service-Sector-Tours/wavier-form/popup/edit-participants/edit-participants.component';
import { PendingForConfirmationComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/pending-for-confirmation.component';
import { ConfirmedToursComponent } from './Components/schedule-tours-and-book-tickets/confirmed-tours/confirmed-tours.component';
import { ConfirmationDenidedComponent } from './Components/schedule-tours-and-book-tickets/confirmation-denided/confirmation-denided.component';
import { ReShedulingRequestComponent } from './Components/schedule-tours-and-book-tickets/re-sheduling-request/re-sheduling-request.component';
import { ParticipantsListComponent } from './Components/schedule-tours-and-book-tickets/confirmed-tours/popup/participants-list/participants-list.component';
import { VolunteerListComponent } from './Components/schedule-tours-and-book-tickets/confirmed-tours/popup/volunteer-list/volunteer-list.component';
import { ScheduleNewComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/schedule-new.component';
import { ScheduleEditComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-edit/schedule-edit.component';
import { ListVolunteerComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/list-volunteer/list-volunteer.component';
import { PendingForValidationComponent } from './Components/validate-complete-tour/pending-for-validation/pending-for-validation.component';
import { ValidationCompletedComponent } from './Components/validate-complete-tour/validation-completed/validation-completed.component';
import { ValidateComponent } from './Components/validate-complete-tour/popup/validate/validate.component';
import { BookIndustrialTourTicketComponent } from './Components/book-industrial-tour-ticket/book-industrial-tour-ticket.component';
import { BookEntryTicketComponent } from './Components/book-industrial-tour-ticket/book-entry-ticket/book-entry-ticket.component';
import { ReviewBookedTicketsComponent } from './Components/book-industrial-tour-ticket/review-booked-tickets/review-booked-tickets.component';
import { MapLeafletComponent } from './Components/book-industrial-tour-ticket/popup/map-leaflet/map-leaflet.component';
import { RequestConfirmationComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/request-confirmation/request-confirmation.component';
import { VideoPlayerComponent } from 'src/app/shared/Video-player/video-player/video-player.component';
import { TestingComponent } from './Industrial-Service-Sector-Tours/testing/testing.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CalanderPoupComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/calander-poup/calander-poup.component';
import { SelectParticipantsComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/select-participants/select-participants.component';
import { SelectVolunteerComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/select-volunteer/select-volunteer.component';
import { ListParticipantsComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/list-participants/list-participants.component';
import { EditListParticipantsComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-edit/edit-list-participants/edit-list-participants.component';
import { EditListVolunteerComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-edit/edit-list-volunteer/edit-list-volunteer.component';
import { EditSelectParticipantsComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-edit/edit-select-participants/edit-select-participants.component';
import { EditSelectVolunteerComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-edit/edit-select-volunteer/edit-select-volunteer.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { ImageSliderComponent } from './Industrial-Service-Sector-Tours/image-slider/image-slider.component';
import { MapLeafletScheduleTourComponent } from './Components/schedule-tours-and-book-tickets/pending-for-confirmation/popup/schedule-new/Tables/map-leaflet-schedule-tour/map-leaflet-schedule-tour.component';
import { AuditTrailDialogueComponent } from 'src/app/shared/dialogs/audit-trail-dialogue/audit-trail-dialogue.component';
import { AuditTrailTableComponent } from 'src/app/shared/dialogs/audit-trail-table/audit-trail-table.component';
import { ParticipantsCertificateShareComponent } from './Industrial-Service-Sector-Tours/participants-certificate-share/participants-certificate-share.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BookVolTicketComponent } from './Components/book-industrial-tour-ticket/book-vol-ticket/book-vol-ticket.component';
import { TourCalanderPopupComponent } from './Industrial-Service-Sector-Tours/tour-sites/tour-calander-popup/tour-calander-popup.component';
import { IframeCommentsComponent } from './Components/iframe-comments/iframe-comments.component';
import { IframeResourcesComponent } from './Components/iframe-resources/iframe-resources.component';
import { IframeFlashcardComponent } from './Components/iframe-flashcard/iframe-flashcard.component';

@NgModule({
  declarations: [
    LaunchScreenAppComponent,
    ScheduleToursAndBookTicketsComponent,
    ValidateCompleteTourComponent,
    GuidelinesComponent,
    TourSitesComponent,
    ParticipationCertificateComponent,
    WavierFormComponent,
    DownloadFormsComponent,
    UploadFormComponent,
    ViewPdfComponent,
    AddParticipantsComponent,
    EditParticipantsComponent,
    PendingForConfirmationComponent,
    ConfirmedToursComponent,
    ConfirmationDenidedComponent,
    ReShedulingRequestComponent,
    ParticipantsListComponent,
    VolunteerListComponent,
    ScheduleNewComponent,
    ScheduleEditComponent,
    ListVolunteerComponent,
    PendingForValidationComponent,
    ValidationCompletedComponent,
    ValidateComponent,
    BookIndustrialTourTicketComponent,
    BookEntryTicketComponent,
    ReviewBookedTicketsComponent,
    MapLeafletComponent,
    RequestConfirmationComponent,
    VideoPlayerComponent,
    TestingComponent,
    CalanderPoupComponent,
    SelectParticipantsComponent,
    SelectVolunteerComponent,
    ListParticipantsComponent,
    EditListParticipantsComponent,
    EditListVolunteerComponent,
    EditSelectParticipantsComponent,
    EditSelectVolunteerComponent,
    ImageSliderComponent,
    MapLeafletScheduleTourComponent,
    AuditTrailDialogueComponent,
    AuditTrailTableComponent,
    ParticipantsCertificateShareComponent,
    BookVolTicketComponent,
    TourCalanderPopupComponent,
    IframeCommentsComponent,
    IframeResourcesComponent,
    IframeFlashcardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CKEditorModule,
    LaunchScreenAppRoutingModule,
    QRCodeModule,
    NgxStarRatingModule,
    NgxScannerQrcodeModule,
    PdfViewerModule,
    // NgxExtendedPdfViewerModule, 
  ],
})
export class LaunchScreenAppModule {}
