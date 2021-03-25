import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'white'},
    {text: 'Two', cols: 1, rows: 2, color: 'white'},
    {text: 'Four', cols: 3, rows: 1, color: 'white'},
  ];

  tilesMobile: Tile[] = [
    {text: 'One', cols: 4, rows: 2, color: 'white'},
    {text: 'Two', cols: 4, rows: 2, color: 'white'},
    {text: 'Three', cols: 4, rows: 2, color: 'white'},
  ];

  ngOnInit(): void {
  }

}
