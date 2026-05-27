import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Model for match suggestions
interface MatchSuggestion {
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  balanceScore: number;
  predictedWinnerId: string;
  confidencePercent: number;
  priorityScore: number;
}

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  
  // Form state
  selectedEventId: string = '';
  selectedSportId: string = '';
  selectedFormat: string = 'roundrobin';
  roundNumber: number = 1;
  
  // Data
  suggestions: MatchSuggestion[] = [];
  events: any[] = [];
  sports: string[] = ['football', 'volleyball', 'basketball', 'badminton', 'tennis'];
  
  // Loading & error states
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  
  private apiBaseUrl = 'http://localhost:8081/streetleague/api';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadEvents();
  }
  
  /**
   * Load events from backend (stub - would integrate with EventService)
   */
  loadEvents(): void {
    // In production: inject EventService and call getEvents()
    // For demo purposes, using hardcoded mock data
    this.events = [
      { id: 'event-1', name: 'Street League 2026' },
      { id: 'event-2', name: 'Spring Tournament' },
      { id: 'event-3', name: 'Championship Finals' }
    ];
  }
  
  /**
   * Generate balanced match suggestions
   */
  generateSuggestions(): void {
    if (!this.selectedEventId || !this.selectedSportId) {
      this.error = 'Please select both an event and sport';
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.success = null;
    
    const url = `${this.apiBaseUrl}/matchmaking/event/${this.selectedEventId}/sport/${this.selectedSportId}?round=${this.roundNumber}&format=${this.selectedFormat}`;
    
    this.http.get<MatchSuggestion[]>(url).subscribe({
      next: (data) => {
        this.suggestions = data;
        this.loading = false;
        
        if (this.suggestions.length === 0) {
          this.error = 'No matches available. All possible pairings already played or insufficient teams.';
        } else {
          this.success = `Generated ${this.suggestions.length} balanced match suggestion(s)`;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 404 
          ? 'Event or sport not found'
          : 'Failed to generate suggestions. Please try again.';
        console.error('Matchmaking error:', err);
      }
    });
  }
  
  /**
   * Get color for balance score (green = balanced, red = unbalanced)
   */
  getBalanceColor(score: number): string {
    if (score > 0.8) return '#109D76'; // Green - excellent balance
    if (score > 0.6) return '#00B7D8'; // Cyan - good balance
    if (score > 0.4) return '#E08B12'; // Warning - moderate balance
    return '#D94848'; // Red - poor balance
  }
  
  /**
   * Get winner badge (emoji + percentage)
   */
  getWinnerBadge(suggestion: MatchSuggestion, teamId: string): string {
    if (suggestion.predictedWinnerId === teamId) {
      return `🏆 ${suggestion.confidencePercent.toFixed(0)}%`;
    }
    return '';
  }
  
  /**
   * Format balance score as percentage
   */
  formatBalancePercent(score: number): string {
    return (score * 100).toFixed(0);
  }
  
  /**
   * Clear all suggestions
   */
  clearSuggestions(): void {
    this.suggestions = [];
    this.error = null;
    this.success = null;
  }
}
