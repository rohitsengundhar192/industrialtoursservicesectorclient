const baseURL_2 = 'https://cephapi.getwow.biz/api/';
const baseURL = 'http://localhost:3000/api/';
// const baseURL = 'https://u7api.getwow.community/api/';
// const baseURL = 'https://u7api.getwow.education/api/';
// const cephTest = 'https://u5api.getwow.community/api/';
const cephTest = 'https://u5api.getwow.community/api/';
// const cephProd = 'https://u5api.getwow.education/api/';
export const environment = {
  production: false,
  baseURL: '',

  //-------------------------Mine Api's-----------------------------//
  //Guidelines Api:
  getcitybasdoncountrycode:
    baseURL +
    'Industrial-Service-Sector-Tours/guidelines/get-city-basedon-country-code',
  getCampVideos:
    baseURL + 'Industrial-Service-Sector-Tours/guidelines/get-camp-videos',

  //Wavier-Form Api's:
  getDropDownCategory:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-dropDown-category',
  getAddParticipantspopup:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-add-participants-popup',

  getDropDownCategoryVolAuth:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-dropDown-category-vol-auth',
  getDropDownCategoryAuthAlone:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-dropDown-category-auth-alone',

  getAddVolPopup:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-add-volunteer-popup',
  getAddAuthPopup:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-add-authorizer-popup',
  gettableDataDownloadForms:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-table-for-download-forms',
  insertAdduserDownloadForms:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/insert-add-user-download-forms',
  updateeditparticipants:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/update-edit-participants',
  deleteuserWavierDetails:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/delete-parcipants-wavier-form',
  updateDownloadpdf:
    baseURL + 'Industrial-Service-Sector-Tours/wavier-form/update-download-pdf',
  gettableDataUploadForms:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/get-table-for-upload-forms',
  uploadupdatesignedform:
    baseURL +
    'Industrial-Service-Sector-Tours/wavier-form/update-upload-signed-form',

  //Book Entry Tickets:
  gettableDataBookEntry:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/get-table-for-book-entry-tickets',
  gettableDataBookvolEntry:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/get-table-for-book-vol-tickets',
  getMapData:
    baseURL + 'Industrial-Service-Sector-Tours/book-industrial/get-map-data',
  getWOWTicketPrice:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/get-wow-ticket-price-based-on-tour-site-id',
  getVolunteerTicketPrice:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/get-volunteer-ticket-price-based-on-tour-site-id',

  insertWOWTicket:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/insert-book-wow-ticket',

  insertVolunteerTicket:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/insert-book-Volunteer-ticket',

  reviewcancelticketsdisplayTable:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/get-review-cancel-tickets-display-table',
  reviewcancelticketsdisplayupdate:
    baseURL +
    'Industrial-Service-Sector-Tours/book-industrial/update-review-cancel-ticket',

  //Camp Tours:

  getTourbasdoncountrycode:
    baseURL +
    'Industrial-Service-Sector-Tours/tour-sites/get-tour-basedon-country-code-toursite',
  getSelectedTourData:
    baseURL +
    'Industrial-Service-Sector-Tours/tour-sites/get-selected-tour-data',
  getSelectedTourRatings:
    baseURL +
    'Industrial-Service-Sector-Tours/tour-sites/get-selected-tour-ratings',

  //Schedule Tour:
  getTourBasedonCountryCodeScheduleTour:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-tour-basedon-country-code-schedule-tour',
  getSelectedTourDataScheduleTour:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-selected-tour-data-schedule-tour',
  getMapLocationName:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-map-location-name',

  getcalenderColor:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-calender-availability-color',

  getTableScheduleNewParticipants:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-schedule-new-participants',

  getTableScheduleNewVolunteeer:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-schedule-new-volunteer',

  getTableScheduleEditParticipants:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-schedule-edit-participants',

  getTableScheduleEditVolunteeer:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-schedule-edit-volunteer',

  scheduleTourInsert:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/insert-activity-group-button',
  updateScheduleTour:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/update-schdeule-tour',
  getTablependingForConfirmationSchdeuleTour:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-schedule-new-pending-confirmation',
  getTableConfirmedTours:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-confirm-tours',
  getTableConfirmedDeniedTours:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-confirm-denied-tours',
  getTableReschedulingTours:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-rescheduling-tours',
  updateCancelScheduledTours:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/update-cancel-schedule-tours',
  updateAcceptRescheduleTrip:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/update-accept-reschedule-trip',
  getTableConfirmedTourListParticipants:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-confirmed-tours-participants-list',

  getTableConfirmedTourListVolunteeer:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-table-confirmed-tours-volunteer-list',

  //Validate Completed Tour Photos and Rate your Experience

  getTableViewPhotosAndValidate:
    baseURL +
    'Industrial-Service-Sector-Tours/validate-complete-tour/get-table-view-photos-and-validate',
  getTableValidationComplete:
    baseURL +
    'Industrial-Service-Sector-Tours/validate-complete-tour/get-table-validation-complete',
  updateViewPhotosValidate:
    baseURL +
    'Industrial-Service-Sector-Tours/validate-complete-tour/update-view-photos-validate',

  //Activity Certifiate
  parent_child_select:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-selected-studentonly-by-user-id',

  selected_student_linked_to_you:
    baseURL + 'Industrial-Service-Sector-Tours/certificate/login-info',
  table_student_data:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-table-details-by-user-id',
  first_stu:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-user-name-birth-date-by-user-id',
  ClassOneToEightUrl:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-nine-to-twelve-colors-url',
  decryptCode:
    baseURL + 'Industrial-Service-Sector-Tours/certificate/on-decrypt-encoded',

  institutiondata:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-customer-details-by-customer-id',
  student_data:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-table-details-by-user-id-certificate',
  //Audit Trail:
  getAuditTrailForWavierForm:
    baseURL +
    'Industrial-Service-Sector-Tours/audit-trail/get-audit-trail-wavier-form',
  getAuditTrailForBookIndustrialTourTicket:
    baseURL +
    'Industrial-Service-Sector-Tours/audit-trail/get-audit-trail-book-industrial-tour-ticket',
  getAuditTrailForScheduleTourandBookTicket:
    baseURL +
    'Industrial-Service-Sector-Tours/audit-trail/get-audit-trail-schedule-tour-book-tickets',
  getAuditTrailForValidateTourAndRatePhotos:
    baseURL +
    'Industrial-Service-Sector-Tours/audit-trail/get-audit-trail-validate-tour-rate-photos',
  getAddressForTouristId:
    baseURL +
    'Industrial-Service-Sector-Tours/certificate/get-address-for-toursite-id',
  getRequestConfirmation:
    baseURL +
    'Industrial-Service-Sector-Tours/schedule-tour/get-request-confirmation-popup',

  //Create table if not exists:
  createTableIndustrialTour:
    baseURL +
    'Industrial-Service-Sector-Tours/audit-trail/post-industrial-tour-create-table',
  // ------------------------------- CEPH Storage -----------------
  create_file: cephTest + 'files-master/file-upload-throw-other-customer-apps',
  update_file: baseURL_2 + 'storage-for-customers/update-file',

  get_file: baseURL_2 + 'storage-for-customers/get-file',
  get_file_multiple_files_based_on_key:
    baseURL_2 + 'storage-for-customers/get-file-multiple-files-based-on-key',
  delete_file_ceph: baseURL_2 + 'storage-for-customers/delete-file',

  ceph_URL: 'https://cephapi.getwow.biz/api/storage/',
  get_file_manage: baseURL_2 + 'storage-for-education-management/get-file',
  get_file_multiple_files_based_on_key_manage:
    baseURL_2 +
    'storage-for-education-management/get-file-multiple-files-based-on-key',

  // --------------------------Wallet -------------------------
  // wow_wallet_pop_up: 'https://p28.getwow.education',
  // get_wallet_pop_up: 'https://p27.getwow.education',

  wow_wallet_pop_up: 'https://p50.getwow.community',
  get_wallet_pop_up: 'https://p50.getwow.community',
};
