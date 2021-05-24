import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';
import {map, startWith} from 'rxjs/operators';
import {UniversityDepartmentModel} from '@models/university-department';

@Component({
  selector: 'app-university-department',
  templateUrl: './university-department.component.html',
  styleUrls: ['./university-department.component.css']
})
export class UniversityDepartmentComponent implements OnInit, AfterViewInit {

  universityDepartmentFormGroup: FormGroup;
  idCtrl = new FormControl();
  public displayedColumns = ['id', 'fullName', 'shortName', 'delete'];
  public dataSource = new MatTableDataSource<UniversityDepartmentModel>();
  filteredIds: Observable<UniversityDepartmentModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllUniversityDepartments();
    this.filteredIds = this.idCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.dataSource.data.filter(universityDepartment => String(universityDepartment.id).includes(id)))
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.universityDepartmentFormGroup = new FormGroup({
      idCtrl: new FormControl(''),
      fullNameCtrl: new FormControl(''),
      shortNameCtrl: new FormControl('')
    });
  }

  getAllUniversityDepartments(): void {
    this.dataManipulation.getUniversityDepartments()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  addUniversityDepartment(universityDepartmentFormGroup): void {
    this.dataManipulation.addUniversityDepartment(
      universityDepartmentFormGroup.fullNameCtrl,
      universityDepartmentFormGroup.shortNameCtrl)
      .subscribe((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  deleteUniversityDepartment(id): void {
    this.dataManipulation.deleteUniversityDepartment(id)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.fullName === data.fullName){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateUniversityDepartment(idCtrl, universityDepartmentFormGroup): void {
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
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
