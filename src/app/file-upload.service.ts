import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DialogData } from './component/menu/menu.component';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

     
  // API url
  baseApiUrl = "https://file.io"
    
  constructor(private http:HttpClient) { }
  
  // Returns an observable
  upload(file:string | ArrayBuffer | null, analise: any):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data

      localStorage.removeItem(`img_${analise.nomeAnalise}$`);
      localStorage.setItem(`img_${analise.nomeAnalise}$`, JSON.stringify(file));
        
      // Make http post request over api
      // with formData as req
      return of(true)
  }

  getImageUploaded(analise : any): Observable<string | ArrayBuffer | null>{

   var result = localStorage.getItem(`img_${analise.nomeAnalise}$`)??'';
   return of(result);

  }
}
