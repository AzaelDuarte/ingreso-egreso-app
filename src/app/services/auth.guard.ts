import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authSvc:AuthService,
              private router:Router){}

  canActivate(): Observable<boolean> {
    return this.authSvc.isAuth()
    .pipe(
      tap(estado => {
        if(!estado) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
