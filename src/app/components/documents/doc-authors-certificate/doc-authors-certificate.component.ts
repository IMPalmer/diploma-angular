import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map } from 'rxjs/operators';
import { AutocompleteService } from '@services/autocomplete.service';
import { FilesGenerationService } from '@services/files-generation.service';
import { AuthorsCertificateModel, AuthorsModel } from '@models/authors-certificate';

@Component({
  selector: 'app-doc-authors-certificate',
  templateUrl: './doc-authors-certificate.component.html',
  styleUrls: ['./doc-authors-certificate.component.css']
})
export class DocAuthorsCertificateComponent implements OnInit {

  authorsCertificate: AuthorsCertificateModel;
  separatorKeysCodes: number[] = [ENTER];
  elVersion = false;

  authorsFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  publishingHouseFormGroup: FormGroup;
  managerFormGroup: FormGroup;
  dateFormGroup: FormGroup;

  authorCtrl = new FormControl();
  filteredAuthors: Observable<AuthorsModel[]>;
  authors: AuthorsModel[] = []; allAuthors: AuthorsModel[] = [];

  managerCtrl = new FormControl();
  filteredManagers: Observable<AuthorsModel[]>;

  publishingHouseCtrl = new FormControl();
  filteredPublishingHouses: Observable<string[]>;
  allPublishingHouses: string[] = [];

  universityDepartmentCtrl = new FormControl();
  filteredUniversityDepartments: Observable<string[]>;
  allUniversityDepartments: string[] = [];

  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>;
  @ViewChild('publishingHouseInput') publishingHouseInput: ElementRef<HTMLInputElement>;
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  @ViewChild('universityDepartmentInput') universityDepartmentInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoAuthor') matAuthorAutocomplete: MatAutocomplete;
  @ViewChild('autoManager') matManagerAutocomplete: MatAutocomplete;
  @ViewChild('autoPublishingHouse') matPublishingHouseAutocomplete: MatAutocomplete;
  @ViewChild('autoUniversityDepartment') matUniversityDepartmentAutocomplete: MatAutocomplete;

  constructor(private autocomplete: AutocompleteService, private filesGeneration: FilesGenerationService) {
    /*this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      map((author: string | null) => author ?
        this.filter(author, this.allAuthors) : this.allAuthors.slice()));
    this.filteredManagers = this.managerCtrl.valueChanges.pipe(
      map((manager: string | null) => manager ?
        this.filter(manager, this.allAuthors) : this.allAuthors.slice()));*/
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      map((author: string | null) => author ? this.allAuthors.filter((a) =>
        a.fullName.toLowerCase().indexOf(author) === 0) : this.allAuthors.slice()));
    this.filteredManagers = this.managerCtrl.valueChanges.pipe(
      map((manager: string | null) => manager ? this.allAuthors.filter((a) =>
          a.fullName.toLowerCase().indexOf(manager) === 0) : this.allAuthors.slice()));
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
          this.allAuthors.push({fullName: scientist.lastName + ' '
            + scientist.firstName + ' ' + scientist.middleName,
            degrees: this.pushDegrees(scientist.degrees)});
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

  pushDegrees(degrees): string[]{
    const degreesNames: string[] = [];
    for (const degree of degrees) {
      degreesNames.push(degree.name);
    }
    return degreesNames;
  }

  initForms(): void{
    this.authorsFormGroup = new FormGroup({
      authorCtrl: new FormControl('', [Validators.required, Validators.minLength(1)])
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
    this.dateFormGroup = new FormGroup({
      dateCtrl: new FormControl('', [Validators.required]),
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    this.allAuthors.forEach(author => {
      if (author.fullName.toLowerCase().includes(value.toLowerCase())) {
        this.authors.push(author);
      }
    });

    if (input) {
      input.value = '';
    }
  }

  remove(author: AuthorsModel): void {
    const index = this.authors.indexOf(author);
    if (index >= 0) {
      this.authors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, dataVariation: string): void {
    switch (dataVariation) {
      case 'scientist': {
        this.authors.push(event.option.value);
        this.authorInput.nativeElement.value = '';
        break;
      }
      case 'manager': {
        this.managerInput.nativeElement.value = event.option.value;
        break;
      }
      case 'publishingHouse': {
        this.publishingHouseInput.nativeElement.value = event.option.value;
        break;
      }
      case 'universityDepartment': {
        this.universityDepartmentInput.nativeElement.value = event.option.value;
        break;
      }
      default: {
        break;
      }
    }
  }

  private filter(value: string, data: string[]): string[] {
    return data.filter(author => author.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  moveToSelectedTab(tabName: string): void {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((document.querySelectorAll('.mat-tab-label-content')[i] as HTMLElement).innerText === tabName)
      {
        (document.querySelectorAll('.mat-tab-label')[i] as HTMLElement).click();
      }
    }
  }

  downloadAuthorsCertificate(materialsFormGroup, publishingHouseFormGroup, dateFormGroup, managerFormGroup): void {
    this.authorsCertificate = {
      format: 0, authors: this.authors,
      publishingNameWithItsStatics: 'навчального посібника «' + materialsFormGroup.titleCtrl + '», '
        + materialsFormGroup.numberOfPagesCtrl + ' сторінок, ' + materialsFormGroup.numberOfImagesCtrl
        + ' рисунків, ' + materialsFormGroup.numberOfTablesCtrl + ' таблиць, ' + this.containsElVersion(this.elVersion),
      publishingHouse: this.publishingHouseCtrl.value,
      publishingDate: dateFormGroup.dateCtrl.toISOString(),
      universityDepartmentName: this.universityDepartmentCtrl.value,
      fullNameOfChiefOfUniversityDepartment: this.managerCtrl.value
    };
    console.log(this.authorsCertificate);
    this.filesGeneration.generateAuthorsCertificate(this.authorsCertificate).subscribe(
      (data) => console.log(data));
  }

  containsElVersion(elVersion: boolean): string {
    if (elVersion) {
      return 'наявна електронна версія';
    } else {
      return 'відсутня електронна версія';
    }
  }
}

