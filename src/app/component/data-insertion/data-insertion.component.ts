import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Model } from 'src/app/model/model';
import { ServiceService } from 'src/app/service.service';
import { Form } from '@angular/forms';
import { DialogData } from '../menu/menu.component';

@Component({
  selector: 'app-data-insertion',
  templateUrl: './data-insertion.component.html',
  styleUrls: ['./data-insertion.component.scss']
})
export class DataInsertionComponent implements OnInit {


  constructor(private service: ServiceService ) {}

  analiseActual?: DialogData;
  
  ordenada: string = '';
  @Input() analise = new Input();
  analises: Model [] =[]; 

  submitted =false;
  displayedColumns: string[] = ['resultado', 'data'];
  dataSource = new MatTableDataSource<Model>([]);
  model ?: Model;
 
  formDados = new FormGroup({
    resultado: new FormControl('',[ Validators.required]),
    date: new FormControl('',[Validators.required])
  });

  get Obterresultado(){
    return this.formDados.get('resultado')?.value ??'';
  }
  
  get Obterdate(){
    return new Date(this.formDados.get('date')?.value ??'');
  }


  ngOnInit(): void {
    this.service.getAnaliseActual().subscribe((analiseActual)=>{
      this.analiseActual = analiseActual;
      this.refresh(); 
});
   
  }

  onSubmit(){
    this.submitted =true;
   this.model = new Model(this.Obterresultado, this.Obterdate);
    this.service.saveResult(this.analise.nomeAnalise, this.model).subscribe((result)=>{
         this.refresh(); 
    });
    
  }

  reset(){
    this.formDados.reset();
  }

  refresh(){
    let name =this.analiseActual?.nomeAnalise;
    this.service.getResultDataObservable(name!).subscribe(data =>{
       this.dataSource.data = data;
       this.analises =data;   
       return;
    })
  }

  updateOrdenada(value:string){
   let valor:number = +value;
   if(!isNaN(valor)){
    this.service.saveOrdenada(valor);
   // location.reload();
   }
  }  
}
