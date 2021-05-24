import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManipulationRoutingModule } from './routing/data-manipulation-routing.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataManipulationRoutingModule,
    MaterialModule
  ]
})
export class DataManipulationModule { }
