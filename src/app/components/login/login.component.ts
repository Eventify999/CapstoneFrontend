<<<<<<< HEAD
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
=======
import { Component } from '@angular/core';
>>>>>>> d254f093dfd5c003da01c1980272f25b01e6e6aa
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
<<<<<<< HEAD
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
=======
            this.toastr.success("Login Successful!", "Success"); // ✅ toast
            localStorage.setItem('loginUser', loginPayload.Username);
            localStorage.setItem('myLogInToken', res.token);
            sessionStorage.setItem('isLogged', 'true');
            this.router.navigateByUrl('dashboard/c');
          } else {
            this.toastr.warning(res.message || "Invalid credentials", "Warning"); // ✅ toast
>>>>>>> d254f093dfd5c003da01c1980272f25b01e6e6aa
          }
        },
        error: (err) => {
          console.error(err);
<<<<<<< HEAD
          alert("Login failed. Please try again.");
=======
          this.toastr.error("Login failed. Please try again.", "Error"); // ✅ toast
>>>>>>> d254f093dfd5c003da01c1980272f25b01e6e6aa
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
<<<<<<< HEAD
    localStorage.removeItem('myLogInToken');
    localStorage.removeItem('userRole');
=======
>>>>>>> d254f093dfd5c003da01c1980272f25b01e6e6aa
    this.router.navigateByUrl('login');
  }
}
