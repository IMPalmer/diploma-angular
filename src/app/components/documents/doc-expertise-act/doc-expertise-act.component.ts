import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthorsModel} from '@models/authors-certificate';
import {AuthService} from '@services/auth.service';
import {AutocompleteService} from '@services/autocomplete.service';
import {FilesGenerationService} from '@services/files-generation.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {CommissionModel, ExpertiseActModel} from '@models/expertise-act';

@Component({
  selector: 'app-doc-expertise-act',
  templateUrl: './doc-expertise-act.component.html',
  styleUrls: ['./doc-expertise-act.component.css']
})
export class DocExpertiseActComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER];
  elVersion = false;

  provostFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  commissionFormGroup: FormGroup;
  authorsFormGroup: FormGroup;
  chiefOfSecurityDepartmentFormGroup: FormGroup;
  dateFormGroup: FormGroup;

  provostCtrl = new FormControl();
  authorCtrl = new FormControl();
  headOfTheCommissionCtrl = new FormControl();
  memberOfTheCommissionCtrl = new FormControl();
  chiefOfSecurityDepartmentCtrl = new FormControl();
  secretaryOfTheCommissionCtrl = new FormControl();

  filteredScientists: Observable<AuthorsModel[]>;

  allScientists: AuthorsModel[] = [];

  authors: AuthorsModel[] = [];
  headOfTheCommission: CommissionModel;
  membersOfTheCommission: CommissionModel[] = [];

  @ViewChild('provostInput') provostInput: ElementRef<HTMLInputElement>;
  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>;
  @ViewChild('headOfTheCommissionInput') headOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('memberOfTheCommissionInput') memberOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('secretaryOfTheCommissionInput') secretaryOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('chiefOfSecurityDepartmentInput') chiefOfSecurityDepartmentInput: ElementRef<HTMLInputElement>;

  constructor(
    private auth: AuthService,
    private autocomplete: AutocompleteService,
    private filesGeneration: FilesGenerationService) {
  }

  ngOnInit(): void {
    this.autocomplete.getAllDataForExpertiseAct(this.allScientists).subscribe();
    this.initForms();
  }

  initForms(): void{
    this.provostFormGroup = new FormGroup({
      provostCtrl: new FormControl('', [Validators.required])
    });
    this.materialsFormGroup = new FormGroup({
      titleCtrl: new FormControl('', [Validators.required]),
      numberOfPagesCtrl: new FormControl('', [Validators.required]),
      numberOfImagesCtrl: new FormControl('', [Validators.required]),
      numberOfTablesCtrl: new FormControl('', [Validators.required])
    });
    this.commissionFormGroup = new FormGroup({
      facultyNumberCtrl: new FormControl('', [Validators.required]),
      headOfTheCommissionCtrl: new FormControl('', [Validators.required]),
      secretaryOfTheCommissionCtrl: new FormControl('', [Validators.required]),
      memberOfTheCommissionCtrl: new FormControl('', [Validators.required])
    });
    this.authorsFormGroup = new FormGroup({
      authorCtrl: new FormControl('', [Validators.required])
    });
    this.chiefOfSecurityDepartmentFormGroup = new FormGroup({
      chiefOfSecurityDepartmentCtrl: new FormControl('', [Validators.required])
    });
    this.dateFormGroup = new FormGroup({
      dateCtrl: new FormControl('', [Validators.required]),
    });
  }

  filterData(ctrl: FormControl): void {
    this.filteredScientists = ctrl.valueChanges.pipe(
      startWith(''),
      map((author) => this.allScientists.filter((a) =>
        a.fullName.toLowerCase().indexOf(author) === 0)));
  }

  add(event: MatChipInputEvent, dataVariation: string): void {
    const input = event.input;
    const value = event.value;

    switch (dataVariation) {
      case 'memberOfTheCommission': {
        this.allScientists.forEach(memberOfTheCommission => {
          if (memberOfTheCommission.fullName.toLowerCase().includes(value.toLowerCase())) {
            this.membersOfTheCommission.push(memberOfTheCommission);
          }
        });
        break;
      }
      case 'authors': {
        this.allScientists.forEach(author => {
          if (author.fullName.toLowerCase().includes(value.toLowerCase())) {
            this.authors.push(author);
          }
        });
        break;
      }
      default: {
        break;
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(author: AuthorsModel, dataVariation: string): void {
    switch (dataVariation) {
      case 'memberOfTheCommission': {
        const index = this.membersOfTheCommission.indexOf(author);
        if (index >= 0) {
          this.membersOfTheCommission.splice(index, 1);
        }
        break;
      }
      case 'authors': {
        const index = this.authors.indexOf(author);
        if (index >= 0) {
          this.authors.splice(index, 1);
        }
        break;
      }

      default: {
        break;
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent, dataVariation: string): void {
    switch (dataVariation) {
      case 'provost': {
        this.provostInput.nativeElement.value = event.option.value;
        break;
      }
      case 'headOfTheCommission': {
        this.headOfTheCommission = event.option.value;
        this.headOfTheCommissionInput.nativeElement.value =
          event.option.value.fullName + ', ' + event.option.value.degrees;
        break;
      }
      case 'secretaryOfTheCommission': {
        this.secretaryOfTheCommissionInput.nativeElement.value = event.option.value;
        break;
      }
      case 'memberOfTheCommission': {
        this.membersOfTheCommission.push(event.option.value);
        this.memberOfTheCommissionInput.nativeElement.value = '';
        break;
      }
      case 'authors': {
        this.authors.push(event.option.value);
        this.authorInput.nativeElement.value = '';
        break;
      }
      case 'chiefOfSecurityDepartment': {
        this.chiefOfSecurityDepartmentInput.nativeElement.value = event.option.value;
        break;
      }
      default: {
        break;
      }
    }
  }

  downloadExpertiseAct(
    materialsFormGroup,
    provostCtrl,
    dateFormGroup,
    commissionFormGroup,
    headOfTheCommissionCtrl,
    secretaryOfTheCommissionCtrl,
    chiefOfSecurityDepartmentCtrl): void {
    this.filesGeneration.generateExpertiseAct(
      this.executeExpertiseActData(
        materialsFormGroup,
        provostCtrl,
        dateFormGroup,
        commissionFormGroup,
        headOfTheCommissionCtrl,
        secretaryOfTheCommissionCtrl,
        chiefOfSecurityDepartmentCtrl)).subscribe(
      result => {
        this.filesGeneration.downloadFile(result,
          'АктЕкспертизи_' + this.auth.user.lastName + '_' + this.auth.user.firstName,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      });
  }

  executeExpertiseActData(
    materialsFormGroup,
    provostCtrl,
    dateFormGroup,
    commissionFormGroup,
    headOfTheCommissionCtrl,
    secretaryOfTheCommissionCtrl,
    chiefOfSecurityDepartmentCtrl): ExpertiseActModel {
    return {
      format: 0,
      provostName: provostCtrl,
      actCreationDate: dateFormGroup.dateCtrl.toISOString(),
      facultyNumber: commissionFormGroup.facultyNumberCtrl,
      headOfTheCommission: headOfTheCommissionCtrl,
      membersOfTheCommission: this.membersOfTheCommission,
      authorsOfThePublication: this.authors,
      publishingNameWithItsStatics:
        materialsFormGroup.titleCtrl + ', '
        + materialsFormGroup.numberOfPagesCtrl + ' сторінок, '
        + materialsFormGroup.numberOfImagesCtrl + ' рисунків, '
        + materialsFormGroup.numberOfTablesCtrl + ' таблиць, '
        + this.containsElVersion(this.elVersion),
      secretaryOfTheCommission: secretaryOfTheCommissionCtrl,
      chiefOfSecurityDepartment: chiefOfSecurityDepartmentCtrl
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
