import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';
import { BadgeComponent } from '../../components/badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, BadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  private matchService = inject(MatchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  match = signal<Match | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  showConfirmDelete = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatchDetail(id);
    }
  }

  loadMatchDetail(id: string): void {
    this.loading.set(true);
    this.matchService.getMatch(id).subscribe({
      next: (data) => {
        this.match.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('Match not found');
        } else {
          this.error.set('Failed to load match');
        }
        this.loading.set(false);
      }
    });
  }

  onEdit(): void {
    // TODO: Open edit modal
  }

  onDelete(): void {
    this.showConfirmDelete.set(true);
  }

  confirmDelete(): void {
    const matchData = this.match();
    if (!matchData) return;

    this.matchService.deleteMatch(matchData.id).subscribe({
      next: () => {
        this.router.navigate(['/matches']);
      },
      error: (err) => {
        this.error.set('Failed to delete match');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/matches']);
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
