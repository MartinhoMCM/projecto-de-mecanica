import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Model } from './model/model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private ordenadaValue = new BehaviorSubject<number>(5);
  private _ordenadaValue_ = this.ordenadaValue.asObservable();

  constructor() { }

   saveResult(tipoAnalise:string, model: Model): Observable<true>{

    let resultadosActuas: Model [] = [];
    let dataResult =this.getCurrentData(tipoAnalise)

    if(dataResult){
        resultadosActuas = dataResult;
        resultadosActuas.push(model);
        localStorage.removeItem(`${tipoAnalise}`);
        localStorage.setItem(`${tipoAnalise}`, JSON.stringify(resultadosActuas));
    }
    // else{
    //   resultadosActuas.push(model)
    //   localStorage.removeItem(`${tipoAnalise}`);
    //   localStorage.setItem(`${tipoAnalise}`, JSON.stringify(model));
    // }
    return of(true);
   }

   getResultData(tipoAnalise:string): Observable<Model[]>{
    if(localStorage.getItem(`${tipoAnalise}`)??''){
      let data = JSON.parse(localStorage.getItem(`${tipoAnalise}`)??'') as Array<Model>;
      return of(data);
    }
   return of([]);
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
}
