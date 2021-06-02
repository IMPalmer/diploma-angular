import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {PublishingHouseModel} from '@models/publishing-house';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {DataManipulationService} from '@services/data-manipulation.service';

@Component({
  selector: 'app-publishing-house',
  templateUrl: './publishing-house.component.html',
  styleUrls: ['./publishing-house.component.css']
})
export class PublishingHouseComponent implements OnInit, AfterViewInit {

  publishingHouseFormGroup: FormGroup;
  idCtrl = null;
  public displayedColumns = [ 'publishingHouse', 'update', 'delete'];
  public dataSource = new MatTableDataSource<PublishingHouseModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('publishingHouseInput') publishingHouseInput: ElementRef<HTMLInputElement>;

  constructor(private dataManipulation: DataManipulationService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPublishingHouses();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.publishingHouseFormGroup = new FormGroup({
      nameCtrl: new FormControl('')
    });
  }

  getAllPublishingHouses(): void {
    this.dataManipulation.getPublishingHouses()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  addPublishingHouse(): void {
    if (this.idCtrl === null) {
      this.dataManipulation.addPublishingHouse(this.publishingHouseInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.push(data);
          this.dataSource.data = [...this.dataSource.data];
          this.publishingHouseInput.nativeElement.value = '';
        });
    } else {
      this.dataManipulation.updatePublishingHouse(this.idCtrl, this.publishingHouseInput.nativeElement.value)
        .subscribe((data) => {
          this.dataSource.data.forEach(el => {
            if (el.id === data.id) {
              this.dataSource.data.splice(this.dataSource.data.indexOf(el), 1, data);
            }
          });
          this.dataSource.data = [...this.dataSource.data];
          this.publishingHouseInput.nativeElement.value = '';
          this.idCtrl = null;
        });
    }
  }

  deletePublishingHouse(id): void {
    this.dataManipulation.deletePublishingHouse(id)
      .subscribe(() => {
        this.dataSource.data.forEach(el => {
          if (el.id === id){
            this.dataSource.data.splice(this.dataSource.data.indexOf(el));
          }
        });
        this.dataSource.data = [...this.dataSource.data];
      });
  }

  updatePublishingHouse(element): void {
    this.publishingHouseInput.nativeElement.value = element.name;
    this.idCtrl = element.id;
  }

  public doFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
