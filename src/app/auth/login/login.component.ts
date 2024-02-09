import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup
  cargando = false;
  uiSubscription!:Subscription;

  constructor(private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login():void {

    if(this.loginForm.invalid){
      return;
    }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //     }
    // });

    const { email, password } = this.loginForm.value;

    this.authSvc.loginUsuario(email, password)
      .then(credenciales => {
          // Swal.close();
          console.log(credenciales);
          this.store.dispatch( ui.stopLoading() );
          this.router.navigate(['/']);
        }
      ).catch( error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message
        });
      });
  }

  loginWithGoogle():void {
    this.authSvc.loginWithGoogle()
    .then(() => this.router.navigate(['/']));
  }
}
