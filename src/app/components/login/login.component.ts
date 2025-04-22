import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
            this.toastr.success("Login Successful!", "Success"); // ✅ toast
            localStorage.setItem('loginUser', loginPayload.Username);
            localStorage.setItem('myLogInToken', res.token);
            sessionStorage.setItem('isLogged', 'true');
            this.router.navigateByUrl('dashboard/c');
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
    this.router.navigateByUrl('login');
  }
}
