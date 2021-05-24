import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {PublishingHouseModel} from '@models/publishing-house';
import {Observable} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-publishing-house',
  templateUrl: './publishing-house.component.html',
  styleUrls: ['./publishing-house.component.css']
})
export class PublishingHouseComponent implements OnInit, AfterViewInit {

  publishingHouseFormGroup: FormGroup;
  idCtrl = new FormControl();
  public displayedColumns = ['id', 'publishingHouse', 'delete'];
  public dataSource = new MatTableDataSource<PublishingHouseModel>();
  filteredIds: Observable<PublishingHouseModel[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPublishingHouses();
    this.filteredIds = this.idCtrl.valueChanges
      .pipe(
        startWith(''),
        map((id) => this.dataSource.data.filter(publishingHouse => String(publishingHouse.id).includes(id)))
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.publishingHouseFormGroup = new FormGroup({
      idCtrl: new FormControl(''),
      nameCtrl: new FormControl('')
    });
  }

  getAllPublishingHouses(): void {
    this.dataManipulation.getPublishingHouses()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  addPublishingHouse(publishingHouseFormGroup): void {
    this.dataManipulation.addPublishingHouse(publishingHouseFormGroup.nameCtrl)
      .subscribe((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  deletePublishingHouse(id): void {
    this.dataManipulation.deletePublishingHouse(id)
      .subscribe((data) => {
        this.dataSource.data.forEach(el => {
          if (el.name === data.name){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updatePublishingHouse(idCtrl, publishingHouseFormGroup): void {
    this.dataManipulation.updatePublishingHouse(idCtrl, publishingHouseFormGroup.nameCtrl)
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
