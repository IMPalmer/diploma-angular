import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map } from 'rxjs/operators';
import { AutocompleteService } from '@services/autocomplete.service';

@Component({
  selector: 'app-doc-authors-certificate',
  templateUrl: './doc-authors-certificate.component.html',
  styleUrls: ['./doc-authors-certificate.component.css']
})
export class DocAuthorsCertificateComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  elVersion = false;

  authorsFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  publishingHouseFormGroup: FormGroup;
  managerFormGroup: FormGroup;
  dataFormGroup: FormGroup;

  authorCtrl = new FormControl();
  filteredAuthors: Observable<string[]>;
  authors: string[] = []; allAuthors: string[] = [];

  managerCtrl = new FormControl();
  filteredManagers: Observable<string[]>;
  managers: string[];

  publishingHouseCtrl = new FormControl();
  filteredPublishingHouses: Observable<string[]>;
  publishingHouses: string[] = []; allPublishingHouses: string[] = [];

  universityDepartmentCtrl = new FormControl();
  filteredUniversityDepartments: Observable<string[]>;
  universityDepartments: string[] = []; allUniversityDepartments: string[] = [];

  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>;
  @ViewChild('publishingHouseInput') publishingHouseInput: ElementRef<HTMLInputElement>;
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  @ViewChild('universityDepartmentInput') universityDepartmentInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoAuthor') matAuthorAutocomplete: MatAutocomplete;
  @ViewChild('autoManager') matManagerAutocomplete: MatAutocomplete;
  @ViewChild('autoPublishingHouse') matPublishingHouseAutocomplete: MatAutocomplete;
  @ViewChild('autoUniversityDepartment') matUniversityDepartmentAutocomplete: MatAutocomplete;

  constructor(private autocomplete: AutocompleteService) {
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      map((author: string | null) => author ?
        this.filter(author, this.allAuthors) : this.allAuthors.slice()));
    this.filteredManagers = this.managerCtrl.valueChanges.pipe(
      map((manager: string | null) => manager ?
        this.filter(manager, this.allAuthors) : this.allAuthors.slice()));
    this.filteredPublishingHouses = this.publishingHouseCtrl.valueChanges.pipe(
      map((publishingHouse: string | null) => publishingHouse ?
        this.filter(publishingHouse, this.allPublishingHouses) : this.allPublishingHouses.slice()));
    this.filteredUniversityDepartments = this.universityDepartmentCtrl.valueChanges.pipe(
      map((universityDepartment: string | null) => universityDepartment ?
        this.filter(universityDepartment, this.allUniversityDepartments) : this.allUniversityDepartments.slice()));
  }

  ngOnInit(): void {
    this.initForms();
    this.getAllData();
  }

  getAllData(): void {
    this.autocomplete.getScientist().subscribe(
      (data) => {
        data.forEach(scientist => {
          this.allAuthors.push(scientist.firstName + ' '
            + scientist.lastName + ' ' + scientist.middleName
            + this.pushDegrees(scientist.degrees));
        });
      });

    this.autocomplete.getUniversityDepartment().subscribe(
      (data) => {
        data.forEach(universityDepartment => {
          this.allUniversityDepartments.push(universityDepartment.fullName
            + '(' + universityDepartment.shortName + ')');
        });
      });

    this.autocomplete.getPublishingHouse().subscribe(
      (data) => {
        data.forEach(publishingHouse => {
          this.allPublishingHouses.push(publishingHouse.name);
        });
      });
  }

  pushDegrees(degrees): string {
    let degreesNames = '';
    for (const el of degrees) {
      degreesNames += ', ' + el.name;
    }
    return degreesNames;
  }

  initForms(): void{
    this.authorsFormGroup = new FormGroup({
      authorCtrl: new FormControl('', [Validators.required]),
    });
    this.materialsFormGroup = new FormGroup({
      titleCtrl: new FormControl('', [Validators.required]),
      numberOfPagesCtrl: new FormControl('', [Validators.required]),
      numberOfImagesCtrl: new FormControl('', [Validators.required]),
      numberOfTablesCtrl: new FormControl('', [Validators.required])
    });
    this.publishingHouseFormGroup = new FormGroup({
      publishingHouseCtrl: new FormControl('', [Validators.required])
    });
    this.managerFormGroup = new FormGroup({
      managerCtrl: new FormControl('', [Validators.required]),
      universityDepartmentCtrl: new FormControl('', [Validators.required])
    });
    this.dataFormGroup = new FormGroup({
      dataCtrl: new FormControl('', [Validators.required]),
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.authors.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(author: string): void {
    const index = this.authors.indexOf(author);
    if (index >= 0) {
      this.authors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, dataVariation: string): void {
    switch (dataVariation) {
      case 'scientist': {
        this.authors.push(event.option.viewValue);
        this.authorInput.nativeElement.value = '';
        break;
      }
      case 'manager': {
        this.managers.push(event.option.viewValue);
        this.managerInput.nativeElement.value = '';
        break;
      }
      case 'publishingHouse': {
        this.publishingHouses.push(event.option.viewValue);
        this.publishingHouseInput.nativeElement.value = '';
        break;
      }
      case 'universityDepartment': {
        this.universityDepartments.push(event.option.viewValue);
        this.universityDepartmentInput.nativeElement.value = '';
        break;
      }
      default: {
        break;
      }
    }
  }

  private filter(value: string, data: string[]): string[] {
    const filterValue = value.toLowerCase();
    return data.filter(author => author.toLowerCase().indexOf(filterValue) === 0);
  }

  moveToSelectedTab(tabName: string): void{
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((document.querySelectorAll('.mat-tab-label-content')[i] as HTMLElement).innerText === tabName)
      {
        (document.querySelectorAll('.mat-tab-label')[i] as HTMLElement).click();
      }
    }
  }
}
