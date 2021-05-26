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
  idCtrl = new FormControl();
  degreeIdCtrl = new FormControl();
  public displayedColumns = ['id', 'firstName', 'lastName', 'middleName', 'degrees', 'delete'];
  public dataSource = new MatTableDataSource<ScientistModel>();
  filteredIds: Observable<ScientistModel[]>;
  allDegrees: DegreeModel[] = []; degreesIds: number[] = [];
  filteredDegreesIds: Observable<DegreeModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('degreeInput') degreeInput: ElementRef<HTMLInputElement>;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllScientists();
    this.filteredIds = this.idCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.dataSource.data.filter(scientist => String(scientist.id).includes(id)))
      );
    this.filteredDegreesIds = this.degreeIdCtrl.valueChanges
      .pipe(
        startWith(''),
        map((degree: string | null) => degree ? this.allDegrees.filter((a) =>
          a.name.toLowerCase().indexOf(degree) === 0) : this.allDegrees.slice())
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getAllDegrees();
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

  addScientist(scientistFormGroup): void {
    this.dataManipulation.addScientist(
      scientistFormGroup.firstNameCtrl,
      scientistFormGroup.lastNameCtrl,
      scientistFormGroup.middleNameCtrl,
      this.degreesIds)
      .subscribe((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  deleteScientist(id): void {
    this.dataManipulation.deleteScientist(id)
      .subscribe(() => {
        this.dataSource.data.forEach(el => {
          if (el.id === id){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updateScientist(idCtrl, scientistFormGroup): void {
    this.dataManipulation.updateScientist(
      idCtrl,
      scientistFormGroup.firstNameCtrl,
      scientistFormGroup.lastNameCtrl,
      scientistFormGroup.middleNameCtrl,
      this.degreesIds
      )
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.id === data.id) {
            this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    this.degreesIds.push(Number(value));

    if (input) {
      input.value = '';
    }
  }

  remove(degree: number): void {
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
