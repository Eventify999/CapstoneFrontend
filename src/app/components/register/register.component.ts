import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // 👈 import ToastrService

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
  toastr = inject(ToastrService); // 👈 inject toastr

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: [this.selectedRole, Validators.required]
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.registerForm.patchValue({ role: role });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const role = formData.role.toLowerCase(); // 'customer' or 'vendor'
      const endpoint = `https://localhost:5005/api/auth/register/${role}`;

      this.http.post(endpoint, formData).subscribe({
        next: (res: any) => {
          this.toastr.success('Registration successful!', 'Success'); // ✅ toast
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Registration failed. Please try again.', 'Error'); // ❌ toast
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields.', 'Validation'); // ⚠️ toast
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
