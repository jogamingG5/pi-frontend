import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { MatchService } from '../../services/match.service';
import { Event } from '../../models/event.model';
import { Match } from '../../models/match.model';
import { BadgeComponent } from '../../components/badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, BadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  private eventService = inject(EventService);
  private matchService = inject(MatchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  event = signal<Event | null>(null);
  matches = signal<Match[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showConfirmDelete = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEventDetail(id);
      this.loadMatches();
    }
  }

  loadEventDetail(id: string): void {
    this.loading.set(true);
    this.eventService.getEvent(id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('Event not found');
        } else {
          this.error.set('Failed to load event');
        }
        this.loading.set(false);
      }
    });
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches.set(data);
      },
      error: (err) => {
        console.error('Failed to load matches:', err);
      }
    });
  }

  getEventMatches(): Match[] {
    const eventData = this.event();
    if (!eventData) return [];
    // Filter matches where eventId === event.id (if backend provides eventId field)
    // For now, return all matches (adjust when backend clarifies)
    return this.matches();
  }

  onEdit(): void {
    // TODO: Open edit modal
  }

  onDelete(): void {
    this.showConfirmDelete.set(true);
  }

  confirmDelete(): void {
    const eventData = this.event();
    if (!eventData) return;

    this.eventService.deleteEvent(eventData.id).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.error.set('Failed to delete event');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
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
