import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ToastService } from '../../services/toast.service';
import { Event } from '../../models/event.model';
import { BadgeComponent } from '../../components/badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner.component';

/**
 * EXAMPLE: Updated Event List Component with Form Validation
 * 
 * Key improvements:
 * 1. Reactive Forms with FormBuilder
 * 2. Real-time form validation
 * 3. Loading and error states
 * 4. Proper error handling
 * 5. Confirmation dialog for delete
 * 
 * Apply this pattern to all list/detail components
 */
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Events</h1>
        <button (click)="openModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + New Event
        </button>
      </div>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="isLoading()"></app-loading-spinner>

      <!-- Error Message -->
      <div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error() }}
        <button (click)="error.set(null)" class="ml-4 font-bold">×</button>
      </div>

      <!-- Filter Section -->
      <div class="mb-6 flex gap-4">
        <select [(ngModel)]="selectedFilter" (change)="onFilterChange()"
                class="px-3 py-2 border border-gray-300 rounded">
          <option value="ALL">All Events</option>
          <option value="LEAGUE">League</option>
          <option value="FRIENDLY">Friendly</option>
          <option value="TOURNAMENT">Tournament</option>
        </select>

        <input [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()"
               type="text" placeholder="Search events..."
               class="flex-1 px-3 py-2 border border-gray-300 rounded">
      </div>

      <!-- Events Grid -->
      <div *ngIf="!isLoading() && filteredEvents().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let event of filteredEvents()" class="border rounded-lg p-4 hover:shadow-lg transition">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg">{{ event.nom }}</h3>
            <app-badge [label]="event.type" [type]="'type'"></app-badge>
          </div>
          <p class="text-gray-600 text-sm mb-2">{{ event.description }}</p>
          <p class="text-sm mb-4">
            <span class="font-semibold">Dates:</span> {{ formatDate(event.dateDebut) }} to {{ formatDate(event.dateFin) }}
          </p>
          <div class="flex gap-2">
            <button (click)="openModal(event)" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
              Edit
            </button>
            <button (click)="onDeleteEvent(event)" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && filteredEvents().length === 0" class="text-center text-gray-500 py-8">
        <p>No events found</p>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">
            {{ editingEvent() ? 'Edit Event' : 'Create Event' }}
          </h2>

          <!-- Form -->
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Event Name -->
            <div>
              <label class="block font-semibold mb-1">Event Name *</label>
              <input formControlName="nom" type="text" class="w-full px-3 py-2 border rounded"
                     [class.border-red-500]="isFieldInvalid('nom')">
              <span *ngIf="isFieldInvalid('nom')" class="text-red-500 text-sm">
                {{ getFieldError('nom') }}
              </span>
            </div>

            <!-- Description -->
            <div>
              <label class="block font-semibold mb-1">Description</label>
              <textarea formControlName="description" class="w-full px-3 py-2 border rounded" rows="3"></textarea>
            </div>

            <!-- Event Type -->
            <div>
              <label class="block font-semibold mb-1">Type *</label>
              <select formControlName="type" class="w-full px-3 py-2 border rounded"
                      [class.border-red-500]="isFieldInvalid('type')">
                <option value="">Select Type</option>
                <option value="LEAGUE">League</option>
                <option value="FRIENDLY">Friendly</option>
                <option value="TOURNAMENT">Tournament</option>
              </select>
              <span *ngIf="isFieldInvalid('type')" class="text-red-500 text-sm">Type is required</span>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block font-semibold mb-1">Start Date *</label>
              <input formControlName="dateDebut" type="date" class="w-full px-3 py-2 border rounded"
                     [class.border-red-500]="isFieldInvalid('dateDebut')">
              <span *ngIf="isFieldInvalid('dateDebut')" class="text-red-500 text-sm">
                {{ getFieldError('dateDebut') }}
              </span>
            </div>

            <!-- End Date -->
            <div>
              <label class="block font-semibold mb-1">End Date *</label>
              <input formControlName="dateFin" type="date" class="w-full px-3 py-2 border rounded"
                     [class.border-red-500]="isFieldInvalid('dateFin')">
              <span *ngIf="isFieldInvalid('dateFin')" class="text-red-500 text-sm">
                {{ getFieldError('dateFin') }}
              </span>
            </div>

            <!-- Form-level Date Range Error -->
            <span *ngIf="eventForm.hasError('invalidDateRange')" class="text-red-500 text-sm block">
              Start date must be before end date
            </span>

            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-4">
              <button type="button" (click)="closeModal()" class="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" [disabled]="!eventForm.valid" 
                      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400">
                {{ editingEvent() ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EventListExample implements OnInit {
  // Signals
  events = signal<Event[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingEvent = signal<Event | null>(null);
  searchQuery = signal('');
  selectedFilter = signal('ALL');

  // Form
  eventForm: FormGroup;

  constructor(
    private eventService: EventService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit() {
    this.loadEvents();
  }

  /**
   * Create reactive form with validators
   */
  private createForm(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      type: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      sportId: ['', [Validators.required]],
      teamsIds: [[]]
    }, {
      validators: this.dateRangeValidator
    });
  }

  /**
   * Custom validator for date range
   */
  private dateRangeValidator(group: FormGroup): {[key: string]: any} | null {
    const startDate = group.get('dateDebut')?.value;
    const endDate = group.get('dateFin')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return { 'invalidDateRange': true };
      }
    }
    return null;
  }

  /**
   * Load events from API
   */
  loadEvents() {
    this.isLoading.set(true);
    this.error.set(null);

    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        // Handle ApiResponse wrapper
        const eventData = response.data || response;
        this.events.set(Array.isArray(eventData) ? eventData : []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load events');
        this.isLoading.set(false);
        console.error('Load error:', err);
      }
    });
  }

  /**
   * Get filtered events based on search and filter
   */
  filteredEvents() {
    const filtered = this.events().filter(event => {
      const matchesFilter = this.selectedFilter() === 'ALL' || event.type === this.selectedFilter();
      const matchesSearch = event.nom.toLowerCase().includes(this.searchQuery().toLowerCase());
      return matchesFilter && matchesSearch;
    });
    return filtered;
  }

  onFilterChange() {
    // Filtered computed signal will automatically update
  }

  onSearchChange() {
    // Filtered computed signal will automatically update
  }

  /**
   * Open modal for create or edit
   */
  openModal(event?: Event) {
    this.editingEvent.set(event || null);
    if (event) {
      this.eventForm.patchValue(event);
    } else {
      this.eventForm.reset();
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.eventForm.reset();
  }

  /**
   * Form submission
   */
  onSubmit() {
    if (!this.eventForm.valid) {
      this.toastService.error('Please fix the form errors');
      return;
    }

    const event = this.editingEvent();
    const request = this.eventForm.value;

    if (event) {
      // Update
      this.eventService.updateEvent(event.id, request).subscribe({
        next: (response: any) => {
          this.toastService.success('Event updated successfully');
          this.closeModal();
          this.loadEvents();
        },
        error: (err) => {
          this.toastService.error('Failed to update event');
          console.error('Update error:', err);
        }
      });
    } else {
      // Create
      this.eventService.createEvent(request).subscribe({
        next: (response: any) => {
          this.toastService.success('Event created successfully');
          this.closeModal();
          this.loadEvents();
        },
        error: (err) => {
          this.toastService.error('Failed to create event');
          console.error('Create error:', err);
        }
      });
    }
  }

  /**
   * Delete with confirmation
   */
  onDeleteEvent(event: Event) {
    if (confirm(`Are you sure you want to delete event "${event.nom}"?`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.toastService.success('Event deleted successfully');
          this.loadEvents();
        },
        error: (err) => {
          this.toastService.error('Failed to delete event');
          console.error('Delete error:', err);
        }
      });
    }
  }

  /**
   * Form validation helpers
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    if (field.errors['maxlength']) return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
    if (field.errors['pattern']) return 'Invalid format';

    return 'Invalid value';
  }

  /**
   * Utility to format dates
   */
  formatDate(date: string | Date | number[]): string {
    if (Array.isArray(date)) {
      // Java LocalDate format: [year, month, day]
      return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString('en-US');
    }
    return new Date(date).toLocaleDateString('en-US');
  }
}
