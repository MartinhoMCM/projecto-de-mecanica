import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DialogData } from './component/menu/menu.component';
import { Model } from './model/model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private ordenadaValue = new BehaviorSubject<number>(5);
  private analiseBehavior = new BehaviorSubject<Model[]>([]);
  private _analiseBehavior = this.analiseBehavior.asObservable();
  private _ordenadaValue_ = this.ordenadaValue.asObservable();

  initializeAnaliseBehavior(){
   this.analiseBehavior.next([]);
  }

  onDestroy(){
    this.analiseBehavior.unsubscribe();
  }

  private analiseActual = new BehaviorSubject<DialogData>({
    nomeAnalise:'Análise de viscosidade',
    unidadeAnalise: 'v'});
  private _analiseActual_ = this.analiseActual.asObservable();

  constructor() { }

   saveResult(tipoAnalise:string, model: Model): Observable<true>{

    let resultadosActuas: Model [] = [];
    let dataResult =this.getCurrentData(tipoAnalise)

    if(dataResult){
        resultadosActuas = dataResult;
        resultadosActuas.push(model);
        localStorage.removeItem(`${tipoAnalise}`);
        localStorage.setItem(`${tipoAnalise}`, JSON.stringify(resultadosActuas));
        this.analiseBehavior.next(resultadosActuas);
    }
    return of(true);
   }

   getResultData(tipoAnalise:string): Observable<Model[]>{
    if(localStorage.getItem(`${tipoAnalise}`)??''){
      let data = JSON.parse(localStorage.getItem(`${tipoAnalise}`)??'') as Array<Model>;  
     this.initializeAnaliseBehavior();
      this.analiseBehavior.next(data);
      return of(data);
    }
   return of([]);
   }

   getResultDataObservable(tipoAnalise:string): Observable<Model[]>{
    if(localStorage.getItem(`${tipoAnalise}`)??''){
      let data = JSON.parse(localStorage.getItem(`${tipoAnalise}`)??'') as Array<Model>;
      this.initializeAnaliseBehavior();
      this.analiseBehavior.next(data);
      return this._analiseBehavior;
    }
    this.initializeAnaliseBehavior();
    this.analiseBehavior.next([]);

   return this._analiseBehavior;
   }
   
   getCurrentData(tipoAnalise:string): Array<Model>{
    let data:Array<Model>;
    data =[];
    if(localStorage.getItem(`${tipoAnalise}`)){
      data = JSON.parse(localStorage.getItem(`${tipoAnalise}`)??'') as Array<Model>;
    }
    
    return data;
  }

  saveOrdenada(value:number){
    this.ordenadaValue.next(value)
    localStorage.setItem("ordenada", `${value}`);
  }
  getOrdenada(): Observable<number>{
    let valor = localStorage.getItem("ordenada")??'';
    
    if(!isNaN(+valor)){
      this.ordenadaValue.next(+valor)
    }
      return this._ordenadaValue_;
  }

  saveDescription(analise: string, descricao: string){
    localStorage.setItem(`${analise}_descricao`, descricao);
  }

  getDescripton(analise: string): string{
    return localStorage.getItem(`${analise}_descricao`)??'';
  }

  saveAnaliseActual(analise: DialogData){
    this.analiseActual.next(analise);
  //  this.saveResult(analise);
  }

  getAnaliseActual(): Observable<DialogData>{
    return this._analiseActual_;
  }



}
