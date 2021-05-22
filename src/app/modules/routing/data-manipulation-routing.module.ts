import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DegreeComponent } from '@components/data-manipulation/degree/degree.component';

const routes: Routes = [
  { path: 'degree', component: DegreeComponent }
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
export class DataManipulationRoutingModule { }
