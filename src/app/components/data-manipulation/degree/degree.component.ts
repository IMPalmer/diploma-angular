import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DegreeModel } from '@models/degree';
import { MatTableDataSource } from '@angular/material/table';
import { DataManipulationService } from '@services/data-manipulation.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})
export class DegreeComponent implements OnInit, AfterViewInit {

  degreeFormGroup: FormGroup;
  idCtrl = new FormControl();
  public displayedColumns = ['id', 'degree', 'delete'];
  public dataSource = new MatTableDataSource<DegreeModel>();
  filteredIds: Observable<DegreeModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllDegrees();
    this.filteredIds = this.idCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.dataSource.data.filter(degree => String(degree.id).includes(id)))
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.degreeFormGroup = new FormGroup({
      idCtrl: new FormControl(''),
      nameCtrl: new FormControl('')
    });
  }

  getAllDegrees(): void {
    this.dataManipulation.getDegrees()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  addDegree(degreeFormGroup): void {
    this.dataManipulation.addDegree(degreeFormGroup.nameCtrl)
      .subscribe((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  deleteDegree(id): void {
    this.dataManipulation.deleteDegree(id)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.name === data.name){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateDegree(idCtrl, degreeFormGroup): void {
    this.dataManipulation.updateDegree(idCtrl, degreeFormGroup.nameCtrl)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.id === data.id) {
            this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
