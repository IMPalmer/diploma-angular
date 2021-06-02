import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { DegreeModel } from '@models/degree';
import { MatTableDataSource } from '@angular/material/table';
import { DataManipulationService } from '@services/data-manipulation.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})
export class DegreeComponent implements OnInit, AfterViewInit {

  degreeFormGroup: FormGroup;
  idCtrl = null;
  public displayedColumns = ['degree', 'update', 'delete'];
  public dataSource = new MatTableDataSource<DegreeModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('degreeInput') degreeInput: ElementRef<HTMLInputElement>;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllDegrees();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.degreeFormGroup = new FormGroup({
      nameCtrl: new FormControl('')
    });
  }

  getAllDegrees(): void {
    this.dataManipulation.getDegrees()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  addDegree(): void {
    if (this.idCtrl === null) {
      this.dataManipulation.addDegree(this.degreeInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.push(data);
          this.dataSource.data = [...this.dataSource.data];
          this.degreeInput.nativeElement.value = '';
        });
    } else {
      this.dataManipulation.updateDegree(this.idCtrl, this.degreeInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.forEach(el => {
            if (el.id === data.id) {
              this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
            }
          });
          this.dataSource.data = [...this.dataSource.data];
          this.degreeInput.nativeElement.value = '';
          this.idCtrl = null;
        });
    }
  }

  deleteDegree(id): void {
    this.dataManipulation.deleteDegree(id)
      .subscribe(() => {
        this.dataSource.data.forEach(el => {
          if (el.id === id){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateDegree(element): void {
    this.degreeInput.nativeElement.value = element.name;
    this.idCtrl = element.id;
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
