import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';
import {UniversityDepartmentModel} from '@models/university-department';

@Component({
  selector: 'app-university-department',
  templateUrl: './university-department.component.html',
  styleUrls: ['./university-department.component.css']
})
export class UniversityDepartmentComponent implements OnInit, AfterViewInit {

  universityDepartmentFormGroup: FormGroup;
  idCtrl = null;
  public displayedColumns = ['fullName', 'shortName', 'update', 'delete'];
  public dataSource = new MatTableDataSource<UniversityDepartmentModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fullNameInput') fullNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('shortNameInput') shortNameInput: ElementRef<HTMLInputElement>;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllUniversityDepartments();
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

  addUniversityDepartment(): void {
    if (this.idCtrl === null) {
      this.dataManipulation.addUniversityDepartment(
        this.fullNameInput.nativeElement.value,
        this.shortNameInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.push(data);
          this.dataSource.data = [...this.dataSource.data];
          this.fullNameInput.nativeElement.value = '';
          this.shortNameInput.nativeElement.value = '';
        });
    } else {
      this.dataManipulation.updateUniversityDepartment(
        this.idCtrl,
        this.fullNameInput.nativeElement.value,
        this.shortNameInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.forEach(el => {
            if (el.id === data.id) {
              this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
            }
          });
          this.dataSource.data = [...this.dataSource.data];
          this.fullNameInput.nativeElement.value = '';
          this.shortNameInput.nativeElement.value = '';
          this.idCtrl = null;
        });
    }
  }

  deleteUniversityDepartment(id): void {
    this.dataManipulation.deleteUniversityDepartment(id)
      .subscribe(() => {
        this.dataSource.data.forEach(el => {
          if (el.id === id){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateUniversityDepartment(element): void {
    this.fullNameInput.nativeElement.value = element.fullName;
    this.shortNameInput.nativeElement.value = element.shortName;
    this.idCtrl = element.id;
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
