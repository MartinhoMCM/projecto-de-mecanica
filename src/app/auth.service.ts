import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
// import { AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isAuthenticated$(): Observable<boolean> {
    return this._authSub$.asObservable();
  }

  constructor(private _router: Router) {
  
  }

  public ngOnDestroy(): void {
    this._authSub$.next(false);
    this._authSub$.complete();
  }

  public login(username: string, password: string): Observable<boolean> {

    if(localStorage.getItem("autenticacao") === null || 
    localStorage.getItem("autenticacao") === undefined){
      let user ={
        name : username,
        password : password
      } 
      localStorage.setItem("autenticacao", JSON.stringify(user))
      return of(true);
    }
    else {
      let user =JSON.parse(localStorage.getItem("autenticacao")??'');

      if(user!=null){
        if(user.name === username && user.password==password){
          return of(true);
        }
      }
    }
    return of(false);
}
}