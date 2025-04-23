import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {

  selectedRole: string = 'Customer';
  registerForm: FormGroup;

  http = inject(HttpClient);
  router = inject(Router);
  fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required]
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = {
        ...this.registerForm.value,
        phoneNumber: String(this.registerForm.value.phoneNumber),
        role: this.selectedRole
      };
      

      console.log('Submitting registration form with data:', formData);
      
      const endpoint = `https://localhost:5005/api/auth/register/${this.selectedRole.toLowerCase()}`;

      this.http.post(endpoint, formData).subscribe({
        next: (res: any) => {
          alert('Registration Successful!');
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert(err?.error?.message || 'Registration failed. Please check your input and try again.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
