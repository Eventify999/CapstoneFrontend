import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  query: string = '';
  locationInput: string = '';
  results: any[] = [];
  lat: number | null = null;
  lon: number | null = null;
  apiKey: string = '04bd19d1259b40009df7bc5cacae7801';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  predefinedLocations = [
    { name: 'Trivandrum', lat: 8.4871538, lon: 76.9476994 },
    { name: 'Bangalore', lat: 12.9767936, lon: 77.590082 },
    { name: 'Kochi', lat: 9.9674277, lon: 76.2454436 },
    { name: 'Coorg', lat: 12.4225809, lon: 75.7365857 }
  ];

  predefinedCategories = [
    { code: 'commercial.food_and_drink', label: 'Restaurant' },
    { code: 'commercial.garden', label: 'Garden' },
    { code: 'accommodation.hotel', label: 'Hotel' },
    { code: 'accommodation.guest_house', label: 'Guest House' },
    { code: 'beach.beach_resort', label: 'Beach Resort' }
  ];

  selectedCategory: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onLocationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const [latStr, lonStr] = value.split(',');
    this.lat = parseFloat(latStr);
    this.lon = parseFloat(lonStr);
    console.log(`Selected location: Latitude ${this.lat}, Longitude ${this.lon}`);
  }
  
  searchPlaces(): void {
    if (!this.lat || !this.lon || !this.selectedCategory) {
      this.errorMessage = 'Please select both location and category';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
  
    const placesUrl = `https://api.geoapify.com/v2/places?categories=${this.selectedCategory}&filter=circle:${this.lon},${this.lat},5000&limit=20&apiKey=${this.apiKey}`;
  
    this.http.get<any>(placesUrl).subscribe({
      next: (placeResponse) => {
        if (placeResponse.features && placeResponse.features.length > 0) {
          this.results = placeResponse.features;
        } else {
          this.results = [];
          this.errorMessage = 'No places found for this category in the selected location';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Places API Error:', error);
        this.errorMessage = 'Error fetching places. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
