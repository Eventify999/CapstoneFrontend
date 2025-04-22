import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  standalone:true,
  imports: [],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit{

  http = inject(HttpClient); 
 userList: any[] = []; 
 ngOnInit(): void { 
 this.getAllUsers() 
 } 
 getAllUsers() { 
 this.http.get("https://localhost:5005/api/auth/users").subscribe((res: any) => { 
 this.userList = res.data; 
 }) 
 } 


}
