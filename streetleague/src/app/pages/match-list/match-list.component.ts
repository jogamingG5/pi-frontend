import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { Match, MatchStatus } from '../../models/match.model';
import { BadgeComponent } from '../../components/badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';
import { ToastContainerComponent } from '../../components/toast.component';
import { MatchModalComponent } from './match-modal.component';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    ToastContainerComponent,
    MatchModalComponent
  ],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {
  private matchService = inject(MatchService);
  @ViewChild(ToastContainerComponent) toastContainer!: ToastContainerComponent;
  @ViewChild(MatchModalComponent) matchModal!: MatchModalComponent;

  matches = signal<Match[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedFilter = signal<MatchStatus | 'ALL'>('ALL');
  showConfirmDelete = signal(false);
  matchToDelete = signal<string | null>(null);
  showModal = signal(false);
  selectedMatch = signal<Match | null>(null);

  filters: (MatchStatus | 'ALL')[] = ['ALL', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading.set(true);
    this.error.set(null);

    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches.set(data);
        console.log('Matches loaded:', JSON.stringify(data, null, 2));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load matches');
        this.toastContainer?.show('Error loading matches', 'error');
        this.loading.set(false);
      }
    });
  }

  getFilteredMatches(): Match[] {
    const filter = this.selectedFilter();
    if (filter === 'ALL') return this.matches();
    return this.matches().filter(m => m.status === filter);
  }

  onFilterChange(filter: MatchStatus | 'ALL'): void {
    this.selectedFilter.set(filter);
  }

  openModal(match?: Match): void {
    if (match) {
      this.selectedMatch.set(match);
    } else {
      this.selectedMatch.set(null);
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedMatch.set(null);
  }

  onMatchSaved(): void {
    this.closeModal();
    this.loadMatches();
    this.toastContainer?.show('Match saved successfully', 'success');
  }

  onEditMatch(match: Match): void {
    this.openModal(match);
  }

  onDeleteMatch(id: string): void {
    this.matchToDelete.set(id);
    this.showConfirmDelete.set(true);
  }

  confirmDelete(): void {
    const id = this.matchToDelete();
    if (!id) return;

    this.matchService.deleteMatch(id).subscribe({
      next: () => {
        this.loadMatches();
        this.showConfirmDelete.set(false);
        this.matchToDelete.set(null);
        this.toastContainer?.show('Match deleted successfully', 'success');
      },
      error: () => {
        this.toastContainer?.show('Error deleting match', 'error');
        this.showConfirmDelete.set(false);
      }
    });
  }

  cancelDelete(): void {
    this.showConfirmDelete.set(false);
    this.matchToDelete.set(null);
  }

  formatDate(dateValue: any): string {
    try {
      // Handle null and undefined
      if (dateValue === null || dateValue === undefined || dateValue === '') {
        return '--';
      }
      
      let year, month, day;
      
      // Handle array format [year, month, day] (Java LocalDate serialization)
      if (Array.isArray(dateValue)) {
        [year, month, day] = dateValue;
      } 
      // Handle ISO 8601 string format (YYYY-MM-DDTHH:mm:ss.SSS or YYYY-MM-DD)
      else if (typeof dateValue === 'string') {
        // Extract just the date part (YYYY-MM-DD)
        const datePart = dateValue.split('T')[0];
        const parts = datePart.split('-');
        if (parts.length === 3) {
          [year, month, day] = parts.map(Number);
        } else {
          return '--';
        }
      } 
      // Handle Date object
      else if (dateValue instanceof Date) {
        year = dateValue.getFullYear();
        month = dateValue.getMonth() + 1;
        day = dateValue.getDate();
      } 
      else {
        return '--';
      }
      
      // Create date without timezone issues
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Date formatting error:', error, dateValue);
      return '--';
    }
  }

  formatTime(timeString: string): string {
    return timeString; // Already in HH:mm format
  }
}
