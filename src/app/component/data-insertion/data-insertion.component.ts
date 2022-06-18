import { Component, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSidenavContainer } from '@angular/material/sidenav';


export interface PeriodicElement {
  resultado: string;
  position: number;
  data: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, resultado: 'Hydrogen', data: 1.0079},
  {position: 2, resultado: 'Helium', data: 4.0026},
  {position: 3, resultado: 'Lithium', data: 6.941},
  {position: 4, resultado: 'Beryllium', data: 9.0122},
  {position: 5, resultado: 'Boron', data: 10.811},
  {position: 6, resultado: 'Carbon', data: 12.0107},
  {position: 7, resultado: 'Nitrogen', data: 14.0067},
  {position: 8, resultado: 'Oxygen', data: 15.9994},
  {position: 9, resultado: 'Fluorine', data: 18.9984},
  {position: 10, resultado: 'Neon', data: 20.1797},
];

@Component({
  selector: 'app-data-insertion',
  templateUrl: './data-insertion.component.html',
  styleUrls: ['./data-insertion.component.scss']
})
export class DataInsertionComponent implements OnInit {

  
  displayedColumns: string[] = ['position', 'resultado', 'data'];
  dataSource = ELEMENT_DATA;

  formDados = new FormGroup({
    resultado: new FormControl('',[ Validators.required]),
    date: new FormControl('',[Validators.required])
  });

  constructor( ) {

   }

  ngOnInit(): void {
  }

}
