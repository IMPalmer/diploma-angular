import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ENTER} from '@angular/cdk/keycodes';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from '@services/auth.service';
import {AutocompleteService} from '@services/autocomplete.service';
import {FilesGenerationService} from '@services/files-generation.service';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {ExpertCommissionProtocolOfMeetingModel} from '@models/expert-commission-protocol-of-meeting';

@Component({
  selector: 'app-doc-expert-commission-protocol-of-meeting',
  templateUrl: './doc-expert-commission-protocol-of-meeting.component.html',
  styleUrls: ['./doc-expert-commission-protocol-of-meeting.component.css']
})
export class DocExpertCommissionProtocolOfMeetingComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER];
  elVersion = false;
  publicationAStateSecret = false;
  publicationContainServiceInformation = false;
  commissionAllowAIssuingOfThePublication = false;

  dateFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  commissionFormGroup: FormGroup;
  expertCommissionResultFormGroup: FormGroup;
  chiefOfSecurityDepartmentFormGroup: FormGroup;

  chiefOfSecurityDepartmentCtrl = new FormControl();
  headOfTheCommissionCtrl = new FormControl();
  speakersOfTheCommissionCtrl = new FormControl();
  membersOfTheCommissionCtrl = new FormControl();
  secretaryOfTheCommissionCtrl = new FormControl();

  filteredScientists: Observable<string[]>;
  allScientists: string[] = [];

  membersOfTheCommission: string[] = [];
  speakersOfTheCommission: string[] = [];

  @ViewChild('headOfTheCommissionInput') headOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('memberOfTheCommissionInput') memberOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('speakerOfTheCommissionInput') speakerOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('secretaryOfTheCommissionInput') secretaryOfTheCommissionInput: ElementRef<HTMLInputElement>;
  @ViewChild('chiefOfSecurityDepartmentInput') chiefOfSecurityDepartmentInput: ElementRef<HTMLInputElement>;

  constructor(
    private auth: AuthService,
    private autocomplete: AutocompleteService,
    private filesGeneration: FilesGenerationService) { }

  ngOnInit(): void {
    this.initForms();
    this.autocomplete.getAllDataForExpertCommissionProtocolOfMeeting(this.allScientists).subscribe();
  }

  initForms(): void{
    this.dateFormGroup = new FormGroup({
      actCopyNumberCtrl: new FormControl('', [Validators.required]),
      dateCtrl: new FormControl('', [Validators.required])
    });
    this.commissionFormGroup = new FormGroup({
      facultyNumberCtrl: new FormControl('', [Validators.required]),
      headOfTheCommissionCtrl: new FormControl('', [Validators.required]),
      secretaryOfTheCommissionCtrl: new FormControl('', [Validators.required]),
      membersOfTheCommissionCtrl: new FormControl('', [Validators.required]),
      speakersOfTheCommissionCtrl: new FormControl('', [Validators.required])
    });
    this.materialsFormGroup = new FormGroup({
      titleCtrl: new FormControl('', [Validators.required]),
      numberOfPagesCtrl: new FormControl('', [Validators.required]),
      numberOfImagesCtrl: new FormControl('', [Validators.required]),
      numberOfTablesCtrl: new FormControl('', [Validators.required])
    });
    this.expertCommissionResultFormGroup = new FormGroup({
      serviceOrSecretInformationCtrl: new FormControl('', [Validators.required]),
    });
    this.chiefOfSecurityDepartmentFormGroup = new FormGroup({
      chiefOfSecurityDepartmentCtrl: new FormControl('', [Validators.required])
    });
  }

  filterData(ctrl: FormControl): void {
    this.filteredScientists = ctrl.valueChanges.pipe(
      startWith(''),
      map((scientist: string | null) => this.allScientists.filter((name) =>
        name.toLowerCase().indexOf(scientist.toLowerCase()) === 0)));
  }

  add(event: MatChipInputEvent, dataVariation: string): void {
    const input = event.input;
    const value = event.value;

    switch (dataVariation) {
      case 'membersOfTheCommission': {
        this.allScientists.forEach(memberOfTheCommission => {
          if (memberOfTheCommission.toLowerCase().includes(value.toLowerCase())) {
            this.membersOfTheCommission.push(memberOfTheCommission);
          }
        });
        break;
      }
      case 'speakersOfTheCommission': {
        this.allScientists.forEach(speakerOfTheCommission => {
          if (speakerOfTheCommission.toLowerCase().includes(value.toLowerCase())) {
            this.speakersOfTheCommission.push(speakerOfTheCommission);
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

  remove(memberOfTheCommission: string): void {
    const index = this.membersOfTheCommission.indexOf(memberOfTheCommission);
    if (index >= 0) {
      this.membersOfTheCommission.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, dataVariation: string): void {
    switch (dataVariation) {
      case 'headOfTheCommission': {
        this.headOfTheCommissionInput.nativeElement.value = event.option.value;
        break;
      }
      case 'secretaryOfTheCommission': {
        this.secretaryOfTheCommissionInput.nativeElement.value = event.option.value;
        break;
      }
      case 'membersOfTheCommission': {
        this.membersOfTheCommission.push(event.option.value);
        this.memberOfTheCommissionInput.nativeElement.value = '';
        break;
      }
      case 'speakersOfTheCommission': {
        this.speakersOfTheCommission.push(event.option.value);
        this.speakerOfTheCommissionInput.nativeElement.value = '';
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

  downloadExpertCommissionProtocolOfMeeting(
    dateFormGroup,
    commissionFormGroup,
    headOfTheCommissionCtrl,
    secretaryOfTheCommissionCtrl,
    materialsFormGroup,
    publicationAStateSecret,
    publicationContainServiceInformation,
    expertCommissionResultFormGroup,
    commissionAllowAIssuingOfThePublication,
    chiefOfSecurityDepartmentCtrl): void {
    this.filesGeneration.generateExpertCommissionProtocolOfMeeting(
      this.executeExpertCommissionProtocolOfMeeting(
        dateFormGroup,
        commissionFormGroup,
        headOfTheCommissionCtrl,
        secretaryOfTheCommissionCtrl,
        materialsFormGroup,
        publicationAStateSecret,
        publicationContainServiceInformation,
        expertCommissionResultFormGroup,
        commissionAllowAIssuingOfThePublication,
        chiefOfSecurityDepartmentCtrl)).subscribe(
      result => {
        this.filesGeneration.downloadFile(result,
          'ПротоколЗасіданняЕкспертноїКомісії_'
          + this.auth.user.lastName + '_' + this.auth.user.firstName,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      });
  }

  executeExpertCommissionProtocolOfMeeting(
    dateFormGroup,
    commissionFormGroup,
    headOfTheCommissionCtrl,
    secretaryOfTheCommissionCtrl,
    materialsFormGroup,
    publicationAStateSecret,
    publicationContainServiceInformation,
    expertCommissionResultFormGroup,
    commissionAllowAIssuingOfThePublication,
    chiefOfSecurityDepartmentCtrl): ExpertCommissionProtocolOfMeetingModel {
    return {
      format: 0,
      actCopyNumber: dateFormGroup.actCopyNumberCtrl,
      facultyNumber: commissionFormGroup.facultyNumberCtrl,
      protocolCreationDate: dateFormGroup.dateCtrl.toISOString(),
      headOfTheCommissionName: headOfTheCommissionCtrl,
      secretaryOfTheCommissionName: secretaryOfTheCommissionCtrl,
      membersOfTheCommissionNames: this.membersOfTheCommission,
      speakersOfTheCommissionName: this.speakersOfTheCommission,
      publishingNameWithItsStatics:
        'навчального посібника «' + materialsFormGroup.titleCtrl + '», '
        + materialsFormGroup.numberOfPagesCtrl + ' сторінок, '
        + materialsFormGroup.numberOfImagesCtrl + ' рисунків, '
        + materialsFormGroup.numberOfTablesCtrl + ' таблиць, '
        + this.containsElVersion(this.elVersion),
      isPublicationAStateSecret: publicationAStateSecret,
      doesPubliscationContainServiceInformation: publicationContainServiceInformation,
      descriptionOfStateSecrectsOrServiceInformation:
        this.containsServiceInformation(expertCommissionResultFormGroup.serviceOrSecretInformationCtrl),
      doesCommissionAllowAIssuingOfThePublication: commissionAllowAIssuingOfThePublication,
      chiefOfSecurityDepartment: chiefOfSecurityDepartmentCtrl
    };
  }

  containsServiceInformation(serviceOrSecretInformation: string): string {
    if (serviceOrSecretInformation === '') {
      return ' ';
    } else {
      return serviceOrSecretInformation;
    }
  }

  containsElVersion(elVersion: boolean): string {
    if (elVersion) {
      return 'наявна електронна версія';
    } else {
      return 'відсутня електронна версія';
    }
  }

}
