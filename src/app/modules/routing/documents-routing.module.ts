import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DocAuthorsCertificateComponent } from '@components/documents/doc-authors-certificate/doc-authors-certificate.component';
import { DocExpertiseActComponent } from '@components/documents/doc-expertise-act/doc-expertise-act.component';
import { DocExpertCommissionProtocolOfMeetingComponent } from '@components/documents/doc-expert-commission-protocol-of-meeting/doc-expert-commission-protocol-of-meeting.component';

const routes: Routes = [
  { path: 'authors-certificate', component: DocAuthorsCertificateComponent },
  { path: 'expertise-act', component: DocExpertiseActComponent },
  { path: 'expert-commission-protocol-of-meeting', component: DocExpertCommissionProtocolOfMeetingComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DocumentsRoutingModule { }
