import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // 👈 Import this

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService // 👈 Inject this
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const loginPayload = {
        Username: formValue.username,
        Password: formValue.password
      };

      this.http.post("https://localhost:5005/api/auth/Login", loginPayload).subscribe({
        next: (res: any) => {
          if (res.result) {
            // Store user data and token in localStorage
            this.toastr.success("Login Successful!", "Success"); // ✅ toast
            localStorage.setItem('loginUser', loginPayload.Username);
            localStorage.setItem('myLogInToken', res.token);
            const userRoles = res.result.roles;
            if (userRoles && userRoles.length > 0) {
              const role = userRoles[0];  // assuming one role per user
              localStorage.setItem('userRole', role);

              if (role === 'Customer') {
                this.router.navigateByUrl('dashboard/c');
              } else if (role === 'Vendor') {
                this.router.navigateByUrl('dashboard/v');
              } else if (role === 'Admin') {
                this.router.navigateByUrl('dashboard');
              }
            }
          } else {
            this.toastr.warning(res.message || "Invalid credentials", "Warning"); // ✅ toast
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Login failed. Please try again.", "Error"); // ✅ toast
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logOff() {
    localStorage.removeItem('loginUser');
    localStorage.removeItem('myLogInToken');
    localStorage.removeItem('userRole');
    this.router.navigateByUrl('login');
  }
}
