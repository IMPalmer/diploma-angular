import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { DocumentsRoutingModule } from './routing/documents-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }
