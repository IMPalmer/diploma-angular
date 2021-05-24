import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';
import {map, startWith} from 'rxjs/operators';
import { ScientistModel } from '@models/scientist';
import { DegreeModel } from '@models/degree';

@Component({
  selector: 'app-scientist',
  templateUrl: './scientist.component.html',
  styleUrls: ['./scientist.component.css']
})
export class ScientistComponent implements OnInit, AfterViewInit {

  scientistFormGroup: FormGroup;
  idCtrl = new FormControl();
  degreeIdCtrl = new FormControl();
  public displayedColumns = ['id', 'firstName', 'lastName', 'middleName', 'degrees', 'delete'];
  public dataSource = new MatTableDataSource<ScientistModel>();
  filteredIds: Observable<ScientistModel[]>;
  allDegrees: DegreeModel[];
  filteredDegreesIds: Observable<DegreeModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllScientists();
    this.getAllDegrees();
    this.filteredIds = this.idCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.dataSource.data.filter(scientist => String(scientist.id).includes(id)))
      );
    this.filteredDegreesIds = this.degreeIdCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.allDegrees.filter(degree => String(degree.id).includes(id)))
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.scientistFormGroup = new FormGroup({
      idCtrl: new FormControl(''),
      firstNameCtrl: new FormControl(''),
      lastNameCtrl: new FormControl(''),
      middleNameCtrl: new FormControl(''),
      degreeIdCtrl: new FormControl('')
    });
  }

  getAllScientists(): void {
    this.dataManipulation.getScientists()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  getAllDegrees(): void {
    this.dataManipulation.getDegrees()
      .subscribe((data) => {
        this.allDegrees = data;
      });
  }

  addScientist(scientistFormGroup, degreeIdCtrl): void {
    this.dataManipulation.addScientist(
      scientistFormGroup.firstNameCtrl,
      scientistFormGroup.lastNameCtrl,
      scientistFormGroup.middleNameCtrl,
      degreeIdCtrl.value)
      .subscribe((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  /*deleteUniversityDepartment(id): void {
    this.dataManipulation.deleteUniversityDepartment(id)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.fullName === data.fullName){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }*/

  /*updateUniversityDepartment(idCtrl, universityDepartmentFormGroup): void {
    this.dataManipulation.updateUniversityDepartment(
      idCtrl,
      universityDepartmentFormGroup.fullNameCtrl,
      universityDepartmentFormGroup.shortNameCtrl)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.id === data.id) {
            this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }*/

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
