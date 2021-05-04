import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-doc-authors-certificate',
  templateUrl: './doc-authors-certificate.component.html',
  styleUrls: ['./doc-authors-certificate.component.css']
})
export class DocAuthorsCertificateComponent implements OnInit {
  authorsFormGroup: FormGroup;
  materialsFormGroup: FormGroup;
  publishingHouseFormGroup: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  authorCtrl = new FormControl();
  filteredAuthors: Observable<string[]>;
  elVersion = false;
  authors: string[] = [];
  allAuthors: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      map((author: string | null) => author ? this.filter(author) : this.allAuthors.slice()));
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms = () => {
    this.authorsFormGroup = new FormGroup({
      authorCtrl: new FormControl('', [Validators.required])
    });
    this.materialsFormGroup = new FormGroup({
      secondCtrl: new FormControl('', [Validators.required])
    });
    this.publishingHouseFormGroup = new FormGroup({
      publishingHouseCtrl: new FormControl('', [Validators.required])
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

    this.authorCtrl.setValue(null);
  }

  remove(author: string): void {
    const index = this.authors.indexOf(author);
    if (index >= 0) {
      this.authors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.authors.push(event.option.viewValue);
    this.authorInput.nativeElement.value = '';
    this.authorCtrl.setValue(null);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allAuthors.filter(author => author.toLowerCase().indexOf(filterValue) === 0);
  }
}
