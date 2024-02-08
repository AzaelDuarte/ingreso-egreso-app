import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registroForm!: FormGroup

  constructor(private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crearUsuario(): void {
    console.log(this.registroForm);
    if (this.registroForm.invalid) {
      return;
    }

    Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();
        }
    });

    const { nombre, correo, password } = this.registroForm.value;

    this.authSvc.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      }
      ).catch(error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message
        });
      });
  }
}
