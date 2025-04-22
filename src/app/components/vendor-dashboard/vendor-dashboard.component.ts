import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
  imports:[FormsModule, CommonModule,ReactiveFormsModule]
})
export class VendorDashboardComponent implements OnInit {
  activeTab = 'requests';
  vendorName = 'Acme Events Co.';
  eventTypeFilter = 'all';
  
  stats = {
    openRequests: 12,
    packagesCreated: 8
  };

  // Sample data - replace with actual API calls
  eventRequests = [
    {
      id: 1,
      eventType: 'wedding',
      eventDate: new Date('2023-12-15'),
      location: 'Grand Ballroom, New York',
      budget: 25000,
      guestCount: 150,
      status: 'pending',
      customerName: 'John & Jane Doe',
      customerEmail: 'john.doe@example.com',
      additionalInfo: 'We need floral arrangements and a live band for the reception.'
    },
    {
      id: 2,
      eventType: 'corporate',
      eventDate: new Date('2023-11-20'),
      location: 'Convention Center, Chicago',
      budget: 50000,
      guestCount: 300,
      status: 'pending',
      customerName: 'Tech Solutions Inc.',
      customerEmail: 'events@techsolutions.com',
      additionalInfo: 'Annual conference with breakout sessions and keynote speakers.'
    },
    {
      id: 3,
      eventType: 'birthday',
      eventDate: new Date('2024-01-05'),
      location: 'Private Residence, Miami',
      budget: 8000,
      guestCount: 50,
      status: 'pending',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      additionalInfo: 'Surprise party with tropical theme.'
    },
    {
      id: 4,
      eventType: 'festival',
      eventDate: new Date('2024-03-10'),
      location: 'Central Park, New York',
      budget: 120000,
      guestCount: 5000,
      status: 'pending',
      customerName: 'Community Arts Foundation',
      customerEmail: 'info@communityarts.org',
      additionalInfo: 'Three-day arts festival with multiple stages and food vendors.'
    }
  ];

  filteredRequests = [...this.eventRequests];
  vendorPackages = [
    {
      id: 1,
      packageType: 'gold',
      name: 'Premium Wedding Package',
      price: 30000,
      eventType: 'wedding',
      description: 'Our most comprehensive wedding package with all the bells and whistles',
      inclusions: [
        'Venue decoration',
        'Catering for 150 guests',
        'Photography & Videography',
        'Live band',
        'Wedding planner'
      ],
      createdAt: new Date('2023-10-01')
    },
    {
      id: 2,
      packageType: 'silver',
      name: 'Standard Corporate Package',
      price: 35000,
      eventType: 'corporate',
      description: 'Professional corporate event package with essential services',
      inclusions: [
        'AV equipment',
        'Stage setup',
        'Catering for 200',
        'Event coordinator'
      ],
      createdAt: new Date('2023-10-05')
    },
    {
      id: 3,
      packageType: 'bronze',
      name: 'Basic Birthday Package',
      price: 5000,
      eventType: 'birthday',
      description: 'Simple yet elegant birthday celebration package',
      inclusions: [
        'Venue setup',
        'Cake and desserts',
        'Basic decorations',
        'DJ services'
      ],
      createdAt: new Date('2023-10-10')
    }
  ];

  selectedRequest: any = null;
  editingPackage: any = null;

  profileForm: FormGroup;
  packageForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.profileForm = this.fb.group({
      companyName: ['Acme Events Co.', Validators.required],
      email: ['vendor@acmeevents.com', [Validators.required, Validators.email]],
      phone: ['(555) 123-4567', Validators.required],
      specialization: ['wedding', Validators.required],
      description: ['We specialize in creating unforgettable wedding experiences with attention to every detail.']
    });

    this.packageForm = this.fb.group({
      packageType: ['gold', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(100)]],
      description: [''],
      inclusions: this.fb.array([this.fb.control('')]),
      notifyCustomer: [true]
    });
  }

  ngOnInit(): void {
    this.filterRequests();
  }

  get inclusions() {
    return this.packageForm.get('inclusions') as FormArray;
  }

  addInclusion() {
    this.inclusions.push(this.fb.control(''));
  }

  removeInclusion(index: number) {
    this.inclusions.removeAt(index);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  filterRequests() {
    if (this.eventTypeFilter === 'all') {
      this.filteredRequests = [...this.eventRequests];
    } else {
      this.filteredRequests = this.eventRequests.filter(
        req => req.eventType === this.eventTypeFilter
      );
    }
  }

  viewRequestDetails(request: any) {
    this.selectedRequest = request;
    this.modalService.open(document.getElementById('requestDetailsModal'));
  }

  openCreatePackageModal(request?: any) {
    this.selectedRequest = request || null;
    this.editingPackage = null;
    
    // Reset form
    this.packageForm.reset({
      packageType: 'gold',
      name: '',
      price: '',
      description: '',
      inclusions: [''],
      notifyCustomer: true
    });
    
    // If editing, populate form
    if (request) {
      this.packageForm.patchValue({
        name: `${request.eventType} Package`,
        price: request.budget * 0.8 // Suggest 80% of customer budget
      });
    }
    
    this.modalService.open(document.getElementById('createPackageModal'));
  }

  editPackage(pkg: any) {
    this.editingPackage = pkg;
    this.packageForm.reset({
      packageType: pkg.packageType,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description,
      notifyCustomer: false
    });
    
    // Clear existing inclusions and add from package
    while (this.inclusions.length) {
      this.inclusions.removeAt(0);
    }
    pkg.inclusions.forEach((inc: string) => {
      this.inclusions.push(this.fb.control(inc));
    });
    
    this.modalService.open(document.getElementById('createPackageModal'));
  }

  savePackage() {
    if (this.packageForm.invalid) return;

    const formValue = this.packageForm.value;
    const newPackage = {
      id: this.editingPackage ? this.editingPackage.id : this.vendorPackages.length + 1,
      packageType: formValue.packageType,
      name: formValue.name,
      price: formValue.price,
      eventType: this.selectedRequest ? this.selectedRequest.eventType : 'custom',
      description: formValue.description,
      inclusions: formValue.inclusions.filter((inc: string) => inc.trim() !== ''),
      createdAt: new Date()
    };

    if (this.editingPackage) {
      // Update existing package
      const index = this.vendorPackages.findIndex(p => p.id === this.editingPackage.id);
      if (index !== -1) {
        this.vendorPackages[index] = newPackage;
      }
    } else {
      // Add new package
      this.vendorPackages.unshift(newPackage);
    }

    // Show success message
    alert(`Package ${this.editingPackage ? 'updated' : 'created'} successfully!`);
    
    // Close modal
    this.modalService.dismissAll();
    
    // Switch to packages tab
    this.activeTab = 'packages';
  }

  deletePackage(id: number) {
    if (confirm('Are you sure you want to delete this package?')) {
      this.vendorPackages = this.vendorPackages.filter(p => p.id !== id);
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    alert('Profile updated successfully!');
  }

  logout() {
    // Implement logout logic
    alert('Logged out successfully!');
  }
}