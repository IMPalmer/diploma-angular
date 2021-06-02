import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';
import {map, startWith} from 'rxjs/operators';
import { ScientistModel } from '@models/scientist';
import { DegreeModel } from '@models/degree';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-scientist',
  templateUrl: './scientist.component.html',
  styleUrls: ['./scientist.component.css']
})
export class ScientistComponent implements OnInit, AfterViewInit {

  separatorKeysCodes: number[] = [ENTER];
  scientistFormGroup: FormGroup;
  idCtrl = null;
  degreeIdCtrl = new FormControl();
  public displayedColumns = ['firstName', 'lastName', 'middleName', 'degrees', 'update', 'delete'];
  public dataSource = new MatTableDataSource<ScientistModel>();
  allDegrees: DegreeModel[] = [];
  degreesIds: DegreeModel[] = [];
  filteredDegreesIds: Observable<DegreeModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('degreeInput') degreeInput: ElementRef<HTMLInputElement>;
  @ViewChild('firstNameInput') firstNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInput') lastNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('middleNameInput') middleNameInput: ElementRef<HTMLInputElement>;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllScientists();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.scientistFormGroup = new FormGroup({
      firstNameCtrl: new FormControl(''),
      lastNameCtrl: new FormControl(''),
      middleNameCtrl: new FormControl(''),
      degreeIdCtrl: new FormControl('')
    });
  }

  filterData(ctrl: FormControl): void {
    this.filteredDegreesIds = ctrl.valueChanges.pipe(
        startWith(''),
        map((degree: string | null) => this.allDegrees.filter((a) =>
          a.name.toLowerCase().indexOf(degree) === 0)));

  }

  getAllScientists(): void {
    this.dataManipulation.getScientists()
      .subscribe((data) => {
        this.dataSource.data = data;
        this.getAllDegrees();
      });
  }

  getAllDegrees(): void {
    this.dataManipulation.getDegrees()
      .subscribe((data) => {
        this.allDegrees = data;
      });
  }

  addScientist(): void {
    if (this.idCtrl === null) {
      this.dataManipulation.addScientist(
        this.firstNameInput.nativeElement.value,
        this.firstNameInput.nativeElement.value,
        this.firstNameInput.nativeElement.value,
        this.degreesIds.map((degree) => {
          return degree.id;
        }))
        .subscribe((data) => {
          this.dataSource.data.push(data);
          this.dataSource.data = [...this.dataSource.data];
          this.firstNameInput.nativeElement.value = '';
          this.lastNameInput.nativeElement.value = '';
          this.middleNameInput.nativeElement.value = '';
          this.degreesIds = [];
        });
    } else {
      this.dataManipulation.updateScientist(
        this.idCtrl,
        this.firstNameInput.nativeElement.value,
        this.lastNameInput.nativeElement.value,
        this.middleNameInput.nativeElement.value,
        this.degreesIds.map((degree) => {
          return degree.id;
        }))
        .subscribe((data) => {
          this.dataSource.data.forEach(el => {
            if (el.id === data.id) {
              this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
            }
          });
          this.dataSource.data = [...this.dataSource.data];
          this.firstNameInput.nativeElement.value = '';
          this.lastNameInput.nativeElement.value = '';
          this.middleNameInput.nativeElement.value = '';
          this.degreesIds = [];
          this.idCtrl = null;
        });
    }
  }

  deleteScientist(id): void {
    this.dataManipulation.deleteScientist(id)
      .subscribe(() => {
        this.dataSource.data.forEach(el => {
          if (el.id === id) {
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateScientist(element): void {
    this.firstNameInput.nativeElement.value = element.firstName;
    this.lastNameInput.nativeElement.value = element.lastName;
    this.middleNameInput.nativeElement.value = element.middleName;
    this.degreesIds = [];
    element.degrees.forEach((degree) => {
      this.degreesIds.push(degree);
    });
    this.idCtrl = element.id;
  }

  add(event: MatChipInputEvent): void {
    this.allDegrees.forEach(degree => {
      if (degree.name.toLowerCase().includes(event.value.toLowerCase())) {
        this.degreesIds.push(degree);
      }
    });

    if (event.input) {
      event.input.value = '';
    }
  }

  remove(degree): void {
    const index = this.degreesIds.indexOf(degree);
    if (index >= 0) {
      this.degreesIds.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.degreesIds.push(event.option.value);
    this.degreeInput.nativeElement.value = '';
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
