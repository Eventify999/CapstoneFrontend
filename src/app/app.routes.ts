import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { VendorDashboardComponent } from './components/vendor-dashboard/vendor-dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { TeamComponent } from './components/team/team.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/c', component:CustomerDashboardComponent },
  { path: 'dashboard/v', component:VendorDashboardComponent },
  { path: 'about', component:AboutComponent },
  { path: 'team', component:TeamComponent }
];
