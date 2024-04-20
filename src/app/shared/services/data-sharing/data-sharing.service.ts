import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  constructor() {}
  private Audit_trail = new BehaviorSubject<string | any>(undefined);
  audit_trail_data = this.Audit_trail.asObservable();

  updateAuditTrailData(data: any) {
    this.Audit_trail.next(data);
  }

  private Assigned_category = new BehaviorSubject<any>(undefined);
  assigned_category_data = this.Assigned_category.asObservable();

  updateAssignedCategoryData(data: any) {
    this.Assigned_category.next(data);
  }

  private share_datato_pdf = new BehaviorSubject<any>(false);
  share_datato_pdf_data = this.share_datato_pdf.asObservable();

  shareDatatoPdf(data: any) {
    this.share_datato_pdf.next(data);
  }

  private download_datetime_function = new BehaviorSubject<boolean>(true);
  download_datetime_function_data =
    this.download_datetime_function.asObservable();

  downloadDatetimeFunction(data: any) {
    this.download_datetime_function.next(data);
  }

  private Change_image = new BehaviorSubject<any>(undefined);
  Change_image_Data = this.Change_image.asObservable();

  ChangeImage(data: any) {
    this.Change_image.next(data);
  }

  private Previous_Change_image = new BehaviorSubject<any>(undefined);
  Previous_Change_image_Data = this.Previous_Change_image.asObservable();

  ChangeImagePrevious(data: any) {
    this.Previous_Change_image.next(data);
  }

  //data share for share wow amount to normal from santhosan app
  private share_ticket_price_id = new BehaviorSubject<any>(undefined);
  share_ticket_price_id_Data = this.share_ticket_price_id.asObservable();

  shareTicketPriceId(data: any) {
    this.share_ticket_price_id.next(data);
  }

  //data share for share wow amount to normal from santhosan app
  private share_trip_id = new BehaviorSubject<any>(undefined);
  share_trip_id_data = this.share_trip_id.asObservable();

  shareTripId(data: any) {
    this.share_trip_id.next(data);
  }

  //data share for share wow amount to normal from santhosan app
  private share_wow_wmount_get_id = new BehaviorSubject<any>(undefined);
  share_wow_wmount_get_id_data = this.share_wow_wmount_get_id.asObservable();

  shareWowAmountgetId(data: any) {
    this.share_wow_wmount_get_id.next(data);
  }

  // share industrial trip id to participant and volunteer in the schedule new popup
  private share_industrial_trip_id_schedule_new = new BehaviorSubject<any>(
    undefined
  );
  share_industrial_trip_id_schedule_new_data =
    this.share_industrial_trip_id_schedule_new.asObservable();

  shareIndustrialTripIdSchdeuleNew(data: any) {
    this.share_industrial_trip_id_schedule_new.next(data);
  }

  // share industrial trip id to participant and volunteer in the schedule Edit popup
  private share_industrial_trip_id_schedule_edit = new BehaviorSubject<any>(
    undefined
  );
  share_industrial_trip_id_schedule_edit_data =
    this.share_industrial_trip_id_schedule_edit.asObservable();

  shareIndustrialTripIdSchdeuleEdit(data: any) {
    this.share_industrial_trip_id_schedule_edit.next(data);
  }

  // share participants user data from select participants to list participants
  private share_select_to_list_participants = new BehaviorSubject<any>(
    undefined
  );
  share_select_to_list_participants_data =
    this.share_select_to_list_participants.asObservable();

  shareSelectToListParticipants(data: any) {
    this.share_select_to_list_participants.next(data);
  }

  // share participants user data from select volunteers to list volunteers
  private share_select_to_list_volunteers = new BehaviorSubject<any>(undefined);
  share_select_to_list_volunteers_data =
    this.share_select_to_list_volunteers.asObservable();

  shareSelectToListVolunteers(data: any) {
    this.share_select_to_list_volunteers.next(data);
  }

  // share edit participants user data from select participants to list participants
  private share_edit_select_to_list_participants = new BehaviorSubject<any>(
    undefined
  );
  share_edit_select_to_list_participants_data =
    this.share_edit_select_to_list_participants.asObservable();

  shareEditSelectToListParticipants(data: any) {
    this.share_edit_select_to_list_participants.next(data);
  }

  // share edit participants user data from select volunteers to list volunteers
  private share_edit_select_to_list_volunteers = new BehaviorSubject<any>(
    undefined
  );
  share_edit_select_to_list_volunteers_data =
    this.share_edit_select_to_list_volunteers.asObservable();

  shareEditSelectToListVolunteers(data: any) {
    this.share_edit_select_to_list_volunteers.next(data);
  }

  // share participants user data from select participants to list participants length
  private share_select_to_list_participants_length = new BehaviorSubject<any>(
    undefined
  );
  share_select_to_list_participants_length_data =
    this.share_select_to_list_participants_length.asObservable();

  shareSelectToListParticipantsLength(data: any) {
    this.share_select_to_list_participants_length.next(data);
  }

  // share participants user data from select volunteers to list volunteers length
  private share_select_to_list_volunteers_length = new BehaviorSubject<any>(
    undefined
  );
  share_select_to_list_volunteers_length_data =
    this.share_select_to_list_volunteers_length.asObservable();

  shareSelectToListVolunteerslength(data: any) {
    this.share_select_to_list_volunteers_length.next(data);
  }

  //share data for schedule new map calling to pass data
  private share_map_dataschedule_new = new BehaviorSubject<any>(undefined);
  share_map_dataschedule_new_data =
    this.share_map_dataschedule_new.asObservable();

  shareMapDatascheduleNew(data: any) {
    this.share_map_dataschedule_new.next(data);
  }

  //For certificates and header:
  private radio_button = new BehaviorSubject<any>(undefined);
  radio_button_data = this.radio_button.asObservable();

  radioButton(data: any) {
    this.radio_button.next(data);
  }

  private disabled_data = new Subject<any>();
  disabled_data_data = this.disabled_data.asObservable();

  disabledData(data: any) {
    this.disabled_data.next(data);
  }

  private Activity_certificate = new BehaviorSubject<any>(undefined);
  Activity_certificate_data = this.Activity_certificate.asObservable();

  ActivityCertificateValues(data: any) {
    this.Activity_certificate.next(data);
  }

  private Activity_certificate_material = new BehaviorSubject<any>(undefined);
  Activity_certificate_data_material =
    this.Activity_certificate_material.asObservable();

  ActivityCertificateValuesMaterial(data: any) {
    this.Activity_certificate_material.next(data);
  }

  private Activity_certificate_top_stu = new BehaviorSubject<any>(undefined);
  Activity_certificate_top_stu_data =
    this.Activity_certificate_top_stu.asObservable();

  ActivityCertificateTopStu(data: any) {
    this.Activity_certificate_top_stu.next(data);
  }

  //show header
  private showTop = new BehaviorSubject<any>(false);
  showTop_data = this.showTop.asObservable();

  update_showTop_data(data: any) {
    this.showTop.next(data);
  }
  private layout = new BehaviorSubject<any>(false);
  layout_data = this.layout.asObservable();

  secondary(data: any) {
    this.layout.next(data);
  }
  private activity_completion_selected_student = new Subject<any>();
  activity_completion_selected_student_data =
    this.activity_completion_selected_student.asObservable();

  updateActivityCompletionSelectedStudent(data: any) {
    this.activity_completion_selected_student.next(data);
  }

  //view pdf conponent
  private share_view_pdf_userid = new BehaviorSubject<any>(undefined);
  share_view_pdf_userid_data = this.share_view_pdf_userid.asObservable();

  shareViewPdfUserid(data: any) {
    this.share_view_pdf_userid.next(data);
  }

  private share_view_pdf = new BehaviorSubject<any>(undefined);
  share_view_pdf_data = this.share_view_pdf.asObservable();

  shareViewPdf(data: any) {
    this.share_view_pdf.next(data);
  }

  //reload table by click reschedule accept to confirmed tour
  private reload_Table_reschedule_accept_to_confirmed_tours =
    new BehaviorSubject<any>(undefined);
  reload_Table_reschedule_accept_to_confirmed_tours_data =
    this.reload_Table_reschedule_accept_to_confirmed_tours.asObservable();

  reloadTableRescheduleAcceptConfirmedTours(data: any) {
    this.reload_Table_reschedule_accept_to_confirmed_tours.next(data);
  }

  //reload table by click pending validation to validateion complete
  private reload_Table_penval_to_valcomplete = new BehaviorSubject<any>(
    undefined
  );
  reload_Table_penval_to_valcomplete_data =
    this.reload_Table_penval_to_valcomplete.asObservable();

  reloadTablePenvalToConfirmedValidation(data: any) {
    this.reload_Table_penval_to_valcomplete.next(data);
  }
}
