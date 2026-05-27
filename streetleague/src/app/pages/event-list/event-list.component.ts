import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { BadgeComponent } from '../../components/badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';
import { EventModalComponent } from './event-modal.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BadgeComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    EventModalComponent
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  @ViewChild(EventModalComponent) eventModal!: EventModalComponent;

  events = signal<Event[]>([]);
  allEvents = signal<Event[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showConfirmDelete = signal(false);
  eventToDelete = signal<string | null>(null);
  showModal = signal(false);
  selectedEvent = signal<Event | null>(null);
  searchQuery = signal('');
  selectedFilter = signal<'ALL' | 'LEAGUE' | 'FRIENDLY'>('ALL');

  ngOnInit(): void {
    console.log('🔥 EventListComponent initialized');
    this.loadEvents();
  }

  filteredEvents() {
    let filtered = this.allEvents();
    
    // Filter by type
    if (this.selectedFilter() !== 'ALL') {
      filtered = filtered.filter(e => e.type === this.selectedFilter());
    }
    
    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(e => e.nom.toLowerCase().includes(query));
    }
    
    return filtered;
  }

  onSearchInputChange(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  loadEvents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log('✅ Events received:', data.length, 'items');
        console.log('First event:', data[0]);
        this.allEvents.set(data);
        this.events.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error.set('Failed to load events');
        this.loading.set(false);
      }
    });
  }

  openModal(event?: Event): void {
    if (event) {
      this.selectedEvent.set(event);
    } else {
      this.selectedEvent.set(null);
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedEvent.set(null);
  }

  onEventSaved(): void {
    this.closeModal();
    this.loadEvents();
  }

  onEditEvent(event: Event): void {
    this.openModal(event);
  }

  onDeleteEvent(id: string): void {
    this.eventToDelete.set(id);
    this.showConfirmDelete.set(true);
  }

  confirmDelete(): void {
    const id = this.eventToDelete();
    if (!id) return;

    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.loadEvents();
        this.showConfirmDelete.set(false);
        this.eventToDelete.set(null);
      },
      error: () => {
        this.showConfirmDelete.set(false);
      }
    });
  }

  cancelDelete(): void {
    this.showConfirmDelete.set(false);
    this.eventToDelete.set(null);
  }

  formatDate(dateValue: any): string {
    try {
      // Handle null and undefined
      if (dateValue === null || dateValue === undefined || dateValue === '') {
        return '--';
      }
      
      let dateObj: Date;
      
      // Handle array format [year, month, day]
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        dateObj = new Date(year, month - 1, day);
      } 
      // Handle string format
      else if (typeof dateValue === 'string') {
        dateObj = new Date(dateValue + 'T00:00:00Z');
      } 
      // Handle Date object
      else if (dateValue instanceof Date) {
        dateObj = dateValue;
      } 
      else {
        return '--';
      }
      
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return '--';
    }
  }
}
