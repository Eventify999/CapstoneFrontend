import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  // private http = inject(HttpClient); 
  // private router = inject(Router); 
  // private fb = inject(FormBuilder);

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],  // 'email' is called 'username' in the control
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }


  userObj : any = {
  };

 
  
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
            alert("Login Success");
            localStorage.setItem('loginUser', loginPayload.Username);
            localStorage.setItem('myLogInToken', res.token); // or res.data.token depending on your API
            sessionStorage.setItem('isLogged','true');
            this.router.navigateByUrl('dashboard/c');
          } else {
            alert(res.message);
          }
        },
        error: (err) => {
          console.error(err);
          alert("Login failed. Please try again");
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

