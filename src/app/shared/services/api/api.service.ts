import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tr } from 'date-fns/locale';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  customer_id: any;
  country_no: any;

  private httpClient: HttpClient;

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.getvalues();
    this.httpClient = new HttpClient(handler);
  }

  getvalues() {
    this.customer_id = localStorage.getItem('customer_id');
    this.country_no = localStorage.getItem('country_no');
  }

  //Mine Api's:

  //Guidelines
  getCityBasedonCountryCode(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getcitybasdoncountrycode}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
  getCampVideos(camp_id: number) {
    return this.http.get<any>(
      `${environment.getCampVideos}?camp_id=${camp_id}`
    );
  }

  //Wavier-Form:
  getDropDownCategory(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getDropDownCategory}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  //Download forms table data:
  gettableDataDownloadForms(
    country_code: string,
    customer_id: number,
    category_id: string,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.gettableDataDownloadForms}?country_code=${country_code}&customer_id=${customer_id}&category_id=${category_id}&page_no=${page_no}&per_page=${per_page}
      `
    );
  }

  // Insert participants to download forms:

  insertAdduserDownloadForms(body: any): Observable<any> {
    return this.http.post<any>(
      `${environment.insertAdduserDownloadForms}`,
      body
    );
  }

  //Add participatants popup

  getAddParticipantspopup(
    country_code: string,
    customer_id: number,
    user_category_id: string
  ) {
    return this.http.get<any>(
      `${environment.getAddParticipantspopup}?country_code=${country_code}&customer_id=${customer_id}&user_category_id=${user_category_id}`
    );
  }
  //Get Add Volunteer popup:
  getAddVolPopup(
    country_code: string,
    customer_id: number,
    user_category_id: string
  ) {
    return this.http.get<any>(
      `${environment.getAddVolPopup}?country_code=${country_code}&customer_id=${customer_id}&user_category_id=${user_category_id}`
    );
  }
  //Get Add Authorizer popup:
  getAddAuthPopup(
    country_code: string,
    customer_id: number,
    user_category_id: string
  ) {
    return this.http.get<any>(
      `${environment.getAddAuthPopup}?country_code=${country_code}&customer_id=${customer_id}&user_category_id=${user_category_id}`
    );
  }
  //Add participants Dropdown volunteer and authorizer category
  getDropDownCategoryVolAuth(
    country_code: string,
    customer_id: number,
    user_category_id: string
  ) {
    return this.http.get<any>(
      `${environment.getDropDownCategoryVolAuth}?country_code=${country_code}&customer_id=${customer_id}&user_category_id=${user_category_id}`
    );
  }

  // Authorizer category filter
  getDropDownCategoryAuthAlone(
    country_code: string,
    customer_id: number,
    user_category_id: string
  ) {
    return this.http.get<any>(
      `${environment.getDropDownCategoryAuthAlone}?country_code=${country_code}&customer_id=${customer_id}&user_category_id=${user_category_id}`
    );
  }

  //Update edit participants
  updateeditparticipants(details: any) {
    return this.http.put<any>(`${environment.updateeditparticipants}`, details);
  }

  //delete wavier user details
  deleteuserWavierDetails(
    country_code: any,
    customer_id: number,
    waiver_form_for_participant_user_id: number,
    login_id: number
  ): Observable<any> {
    return this.http.delete<any>(
      `${environment.deleteuserWavierDetails}?country_code=${country_code}&customer_id=${customer_id}&waiver_form_for_participant_user_id=${waiver_form_for_participant_user_id}&login_id=${login_id}`
    );
  }

  //update download pdf:
  updateDownloadpdf(
    country_code: string,
    customer_id: number,
    user_id: number,
    waiver_form_download_datetime: any,
    login_id: number
  ): Observable<any> {
    return this.http.put(
      `${environment.updateDownloadpdf}?country_code=${country_code}&customer_id=${customer_id}&user_id=${user_id}&waiver_form_download_datetime=${waiver_form_download_datetime}&login_id=${login_id}`,
      null
    );
  }

  //upload forms:
  //upload forms table data:
  gettableDataUploadForms(
    country_code: string,
    customer_id: number,
    category_id: string,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.gettableDataUploadForms}?country_code=${country_code}&customer_id=${customer_id}&category_id=${category_id}&page_no=${page_no}&per_page=${per_page}
        `
    );
  }
  uploadupdatesignedform(body: any): Observable<any> {
    return this.http.post(`${environment.uploadupdatesignedform}`, body);
  }

  //Book Entry Tickets:

  //book entry tickets table data:
  gettableDataBookEntry(
    country_code: string,
    customer_id: number,
    category_id: string,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.gettableDataBookEntry}?country_code=${country_code}&customer_id=${customer_id}&category_id=${category_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }
  gettableDataBookvolEntry(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.gettableDataBookvolEntry}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }
  getMapData(industrial_tour_site_id: number) {
    return this.http.get<any>(
      `${environment.getMapData}?industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  getWOWTicketPrice(industrial_tour_site_id: number) {
    return this.http.get<any>(
      `${environment.getWOWTicketPrice}?industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  getVolunteerTicketPrice(industrial_tour_site_id: number) {
    return this.http.get<any>(
      `${environment.getVolunteerTicketPrice}?industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  reviewcancelticketsdisplayTable(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.reviewcancelticketsdisplayTable}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  reviewcancelticketsdisplayupdate(
    country_code: string,
    customer_id: number,
    login_id: number,
    user_id: number,
    ticket_for_industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.put(
      `${environment.reviewcancelticketsdisplayupdate}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&user_id=${user_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`,
      null
    );
  }
  insertWOWTicket(
    country_code: string,
    customer_id: number,
    login_id: number,
    user_id: number,
    industrial_tour_site_id: number,
    entry_ticket_debit_transaction_id: number
  ): Observable<any> {
    return this.http.post(
      `${environment.insertWOWTicket}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&user_id=${user_id}&industrial_tour_site_id=${industrial_tour_site_id}&entry_ticket_debit_transaction_id=${entry_ticket_debit_transaction_id}`,
      null
    );
  }

  insertVolunteerTicket(
    country_code: string,
    customer_id: number,
    login_id: number,
    user_id: number,
    industrial_tour_site_id: number,
    entry_ticket_debit_transaction_id: number
  ): Observable<any> {
    return this.http.post(
      `${environment.insertVolunteerTicket}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&user_id=${user_id}&industrial_tour_site_id=${industrial_tour_site_id}&entry_ticket_debit_transaction_id=${entry_ticket_debit_transaction_id}`,
      null
    );
  }

  //Camp sites:
  getTourBasedonCountryCode(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getTourbasdoncountrycode}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  getSelectedTourData(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ) {
    return this.http.get<any>(
      `${environment.getSelectedTourData}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }
  getSelectedTourRatings(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_id: number
  ) {
    return this.http.get<any>(
      `${environment.getSelectedTourRatings}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_id=${industrial_tour_trip_id}`
    );
  }

  //ScheduleTour:
  //Camp sites:
  getTourBasedonCountryCodeScheduleTour(
    country_code: string,
    customer_id: number
  ) {
    return this.http.get<any>(
      `${environment.getTourBasedonCountryCodeScheduleTour}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  getSelectedTourDataScheduleTour(industrial_tour_site_id: number) {
    return this.http.get<any>(
      `${environment.getSelectedTourDataScheduleTour}?industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  getMapLocationName(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ) {
    return this.http.get<any>(
      `${environment.getMapLocationName}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  getcalenderColor(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getcalenderColor}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  // Get table data for the schedule tour popup participants:

  getTableScheduleNewParticipants(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableScheduleNewParticipants}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  // Get table data for the schedule tour volunteer

  getTableScheduleNewVolunteeer(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableScheduleNewVolunteeer}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }

  // Get table data for the schedule edit tour popup participants:

  getTableScheduleEditParticipants(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableScheduleEditParticipants}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`
    );
  }

  // Get table data for the schedule edit tour volunteer

  getTableScheduleEditVolunteeer(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableScheduleEditVolunteeer}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`
    );
  }

  // Get table data for the confirmed tour popup participants:

  getTableConfirmedTourListParticipants(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableConfirmedTourListParticipants}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`
    );
  }

  // Get table data for the confirmed tour volunteer

  getTableConfirmedTourListVolunteeer(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableConfirmedTourListVolunteeer}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`
    );
  }
  //Insert into schedule

  scheduleTourInsert(
    country_code: string,
    customer_id: number,
    login_id: number,
    trip_datetime: string,
    industrial_tour_trip_id: number,
    name: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.scheduleTourInsert}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&trip_datetime=${trip_datetime}&industrial_tour_trip_id=${industrial_tour_trip_id}`,
      name
    );
  }

  //update into schedule edit

  updateScheduleTour(
    country_code: string,
    customer_id: number,
    login_id: number,
    trip_datetime: string,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number,
    name: string
  ): Observable<any> {
    return this.http.put<any>(
      `${environment.updateScheduleTour}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&trip_datetime=${trip_datetime}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`,
      name
    );
  }

  // List of Scheduled Tours and Pending for Confirmation:

  getTablependingForConfirmationSchdeuleTour(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTablependingForConfirmationSchdeuleTour}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
  // List of Scheduled Tours and Confirmed Tours:
  getTableConfirmedTours(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableConfirmedTours}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  // List of Scheduled Tours and Confirmation Denied:
  getTableConfirmedDeniedTours(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableConfirmedDeniedTours}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  // List of Scheduled Tours and Re-Scheduling Requests:
  getTableReschedulingTours(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableReschedulingTours}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  //Validate Completed Tour Photos and Rate your Experience
  //Get table data for View Photos and Validate:
  getTableViewPhotosAndValidate(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableViewPhotosAndValidate}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  //Get table data for  Validation Completed:
  getTableValidationComplete(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.getTableValidationComplete}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  //get request confirmation popup
  getRequestConfirmation(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ) {
    return this.http.get<any>(
      `${environment.getRequestConfirmation}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`
    );
  }
  //Cancel schedule tours:
  updateCancelScheduledTours(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number,
    login_id: number
  ): Observable<any> {
    return this.http.put(
      `${environment.updateCancelScheduledTours}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}&login_id=${login_id}`,
      null
    );
  }

  //update accept reschedule trips
  updateAcceptRescheduleTrip(
    country_code: string,
    customer_id: number,
    industrial_tour_trip_schedule_id: number,
    industrial_tour_site_id: number,
    trip_scheduled_datetime: string,
    login_id: number
  ): Observable<any> {
    return this.http.put(
      `${environment.updateAcceptRescheduleTrip}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&industrial_tour_site_id=${industrial_tour_site_id}&trip_scheduled_datetime=${trip_scheduled_datetime}&login_id=${login_id}`,
      null
    );
  }

  //update the view photos and validate

  updateViewPhotosValidate(
    country_code: string,
    customer_id: number,
    login_id: number,
    industrial_tour_trip_schedule_id: number,
    ticket_for_industrial_tour_site_id: number,
    name: string
  ): Observable<any> {
    return this.http.put<any>(
      `${environment.updateViewPhotosValidate}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}&industrial_tour_trip_schedule_id=${industrial_tour_trip_schedule_id}&ticket_for_industrial_tour_site_id=${ticket_for_industrial_tour_site_id}`,
      name
    );
  }

  //Audit Trail:
  getAuditTrailForWavierForm(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getAuditTrailForWavierForm}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  getAuditTrailForBookIndustrialTourTicket(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getAuditTrailForBookIndustrialTourTicket}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  getAuditTrailForScheduleTourandBookTicket(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getAuditTrailForScheduleTourandBookTicket}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  getAuditTrailForValidateTourAndRatePhotos(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getAuditTrailForValidateTourAndRatePhotos}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  //Create table if not exits:
  createTableIndustrialTour(
    country_code: string,
    customer_id: number,
    industrial_tour_site_id: number
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.createTableIndustrialTour}?country_code=${country_code}&customer_id=${customer_id}&industrial_tour_site_id=${industrial_tour_site_id}`,
      null
    );
  }

  //Activity Certificate

  parent_child_select(
    country_code: any,
    customer_id: number,
    parent_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.parent_child_select}?country_code=${country_code}&customer_id=${customer_id}&parent_id=${parent_id}`
    );
  }

  parent_child_select_new(
    country_code: string,
    customer_id: number,
    user_id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.selected_student_linked_to_you}?country_code=${country_code}&Customer_id=${customer_id}&User_id=${user_id}`
    );
  }
  student_data(
    country_code: string,
    customer_id: number,
    stu_data: any
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.student_data}?country_code=${country_code}&customer_id=${customer_id}&student_user_id=${stu_data}`
    );
  }

  //Table
  table_student_data(
    country_code: string,
    customer_id: number,
    student_user_id: any,
    page_no: number,
    per_page: number
  ): Observable<any> {
    // console.log(stu_data);
    return this.http.get<any>(
      `${environment.table_student_data}?country_code=${country_code}&customer_id=${customer_id}&student_user_id=${student_user_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  first_student_data(
    country_code: string,
    customer_id: number,
    stu_id: any
  ): Observable<any> {
    // console.log(stu_data);
    return this.http.get<any>(
      `${environment.first_stu}?country_code=${country_code}&customer_id=${customer_id}&student_id=${stu_id}`
    );
  }

  ClassOneToEightUrl(
    country_code: string,
    customer_id: number,
    user_id: any,
    map_location_display_name: string,
    trip_datetime: string,
    // address: string,
    industrial_tour_site_id: any,
    token: string
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.ClassOneToEightUrl}?country_code=${country_code}&customer_id=${customer_id}&user_id=${user_id}&map_location_display_name=${map_location_display_name}&trip_datetime=${trip_datetime}&industrial_tour_site_id=${industrial_tour_site_id}&token=${token}`
    );
  }

  decryptCode(hash: string): Observable<any> {
    return this.http.get<any>(`${environment.decryptCode}?hash=${hash}`);
  }

  institutiondata(customer_id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.institutiondata}?customer_id=${customer_id}`
    );
  }

  getAddressForTouristId(
    country_code: string,
    customer_id: number
  ): Observable<any> {
    // console.log(stu_data);
    return this.http.get<any>(
      `${environment.getAddressForTouristId}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
}
