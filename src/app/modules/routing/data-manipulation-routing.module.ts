import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DegreeComponent } from '@components/data-manipulation/degree/degree.component';
import { PublishingHouseComponent } from '@components/data-manipulation/publishing-house/publishing-house.component';
import { UniversityDepartmentComponent } from '@components/data-manipulation/university-department/university-department.component';
import {ScientistComponent} from '@components/data-manipulation/scientist/scientist.component';

const routes: Routes = [
  { path: 'degree', component: DegreeComponent },
  { path: 'publishing-house', component: PublishingHouseComponent },
  { path: 'university-department', component: UniversityDepartmentComponent},
  { path: 'scientist', component: ScientistComponent}
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
