import { LoginService } from "../Services/login/login.service";
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private _authService: LoginService, private _router: Router){}
  canActivate(): boolean{
    if (this._authService.IsAdmin()){
      return true;
    }
    else{
        this._router.navigate(['/error']);
        return false;
    }
  }
}
