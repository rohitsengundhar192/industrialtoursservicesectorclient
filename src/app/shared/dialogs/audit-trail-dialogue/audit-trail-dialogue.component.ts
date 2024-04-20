import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-audit-trail-dialogue',
  templateUrl: './audit-trail-dialogue.component.html',
  styleUrls: ['./audit-trail-dialogue.component.scss']
})
export class AuditTrailDialogueComponent implements OnInit {
  auditTrailData: any;
  constructor(
    public auditTrailDialogRef: MatDialogRef<AuditTrailDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.auditTrailData = data;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.auditTrailDialogRef.close(true);
  }
}
