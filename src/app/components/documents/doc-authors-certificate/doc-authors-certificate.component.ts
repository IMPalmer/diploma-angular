import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import { AutocompleteService } from '@services/autocomplete.service';
import { FilesGenerationService } from '@services/files-generation.service';
import { AuthorsCertificateModel, AuthorsModel } from '@models/authors-certificate';
import { UserModel } from '@models/user';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-doc-authors-certificate',
  templateUrl: './doc-authors-certificate.component.html',
  styleUrls: ['./doc-authors-certificate.component.css']
})
export class DocAuthorsCertificateComponent implements OnInit {

  user: UserModel;

  separatorKeysCodes: number[] = [ENTER];
  elVersion = false;

  authorsFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  publishingHouseFormGroup: FormGroup;
  managerFormGroup: FormGroup;
  dateFormGroup: FormGroup;

  authorCtrl = new FormControl();
  filteredAuthors: Observable<AuthorsModel[]>;
  authors: AuthorsModel[] = [];
  allAuthors: AuthorsModel[] = [];

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

  constructor(
    private auth: AuthService,
    private autocomplete: AutocompleteService,
    private filesGeneration: FilesGenerationService) {
  }

  ngOnInit(): void {
    this.initForms();
    this.autocomplete.getAllDataForAuthorsCertificate(
      this.allAuthors,
      this.allPublishingHouses,
      this.allUniversityDepartments)
      .subscribe();
  }

  initForms(): void{
    this.authorsFormGroup = new FormGroup({
      authorCtrl: new FormControl('', [Validators.required])
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
    this.allAuthors.forEach(author => {
      if (author.fullName.toLowerCase().includes(event.value.toLowerCase())) {
        this.authors.push(author);
      }
    });

    if (event.input) {
      event.input.value = '';
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

  filterData(ctrl: FormControl, dataVariation: string): void {
    switch (dataVariation) {
      case 'scientist': {
        this.filteredAuthors = ctrl.valueChanges.pipe(
          startWith(''),
          map((author) => this.allAuthors.filter((a) =>
            a.fullName.toLowerCase().indexOf(author) === 0)));
        break;
      }
      case 'manager': {
        this.filteredManagers = ctrl.valueChanges.pipe(
          startWith(''),
          map((manager: string | null) => this.allAuthors.filter((a) =>
            a.fullName.toLowerCase().indexOf(manager) === 0)));
        break;
      }
      case 'publishingHouse': {
        this.filteredPublishingHouses = ctrl.valueChanges.pipe(
          startWith(''),
          map((publishingHouse: string | null) =>
            this.autocomplete.filter(publishingHouse, this.allPublishingHouses)));
        break;
      }
      case 'universityDepartment': {
        this.filteredUniversityDepartments = ctrl.valueChanges.pipe(
          startWith(''),
          map((universityDepartment: string | null) =>
            this.autocomplete.filter(universityDepartment, this.allUniversityDepartments)));
        break;
      }
      default: {
        break;
      }
    }
  }

  downloadAuthorsCertificate(
    materialsFormGroup,
    dateFormGroup,
    publishingHouseCtrl,
    universityDepartmentCtrl,
    managerCtrl): void {
    this.filesGeneration.generateAuthorsCertificate(
      this.executeAuthorsCertificateData(
        materialsFormGroup,
        dateFormGroup,
        publishingHouseCtrl,
        universityDepartmentCtrl,
        managerCtrl)).subscribe(
      result => {
        this.filesGeneration.downloadFile(result,
          'АвторськаДовідка_' + this.auth.user.lastName + '_' + this.auth.user.firstName,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      });
  }

  executeAuthorsCertificateData(
    materialsFormGroup,
    dateFormGroup,
    publishingHouseCtrl,
    universityDepartmentCtrl,
    managerCtrl): AuthorsCertificateModel {
    return {
      format: 0,
      authors: this.authors,
      publishingNameWithItsStatics:
        materialsFormGroup.titleCtrl + ', '
        + materialsFormGroup.numberOfPagesCtrl + ' сторінок, '
        + materialsFormGroup.numberOfImagesCtrl + ' рисунків, '
        + materialsFormGroup.numberOfTablesCtrl + ' таблиць, '
        + this.containsElVersion(this.elVersion),
      publishingHouse: publishingHouseCtrl,
      publishingDate: dateFormGroup.dateCtrl.toISOString(),
      universityDepartmentName: universityDepartmentCtrl,
      fullNameOfChiefOfUniversityDepartment: managerCtrl
    };
  }

  containsElVersion(elVersion: boolean): string {
    if (elVersion) {
      return 'наявна електронна версія';
    } else {
      return 'відсутня електронна версія';
    }
  }
}

