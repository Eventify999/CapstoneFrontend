import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],  // 'email' is called 'username' in the control
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const loginPayload = {
        Username: formValue.username,  // match your backend DTO property names
        Password: formValue.password
      };

      this.http.post("https://localhost:5005/api/auth/Login", loginPayload).subscribe({
        next: (res: any) => {
          if (res.result) {
            // Store user data and token in localStorage
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
            alert(res.message);
          }
        },
        error: (err) => {
          console.error(err);
          alert("Login failed. Please try again.");
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
