import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassementService } from '../../services/statistiques.service';
import { Classement, ClassementEntry } from '../../models/statistiques.model';

@Component({
  selector: 'app-classement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {
  classements: Classement[] = [];
  selectedClassement: Classement | null = null;
  eventId: string = '';
  sportId: string = '';
  loading: boolean = false;
  error: string = '';

  medalColors = ['gold', 'silver', '#CD7F32']; // Or, Argent, Bronze

  constructor(private classementService: ClassementService) {}

  ngOnInit(): void {
    this.loadAllClassements();
  }

  loadAllClassements(): void {
    this.loading = true;
    this.error = '';
    this.classementService.getAll().subscribe({
      next: (data) => {
        this.classements = data;
        if (data.length > 0) {
          this.selectedClassement = data[0];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des classements';
        console.error(err);
        this.loading = false;
      }
    });
  }

  searchByEventAndSport(): void {
    if (!this.eventId || !this.sportId) {
      this.error = 'Veuillez remplir l\'événement et le sport';
      return;
    }

    this.loading = true;
    this.error = '';
    this.classementService.getByEventIdAndSportId(this.eventId, this.sportId).subscribe({
      next: (data) => {
        this.selectedClassement = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Aucun classement trouvé pour ces critères';
        console.error(err);
        this.loading = false;
      }
    });
  }

  getMedalColor(rang: number): string {
    return this.medalColors[rang - 1] || '#999999';
  }

  getMedalIcon(rang: number): string {
    switch (rang) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '#' + rang;
    }
  }

  getWinRateClass(taux: number): string {
    if (taux >= 70) return 'text-green-600 font-bold';
    if (taux >= 50) return 'text-blue-600';
    if (taux >= 30) return 'text-orange-600';
    return 'text-red-600';
  }

  selectClassement(classement: Classement): void {
    this.selectedClassement = classement;
  }

  getTotalMatches(): number {
    if (!this.selectedClassement?.classements?.length) return 0;
    return this.selectedClassement.classements.reduce((sum, c) => sum + c.matchsJoues, 0);
  }

  getBestAttack(): number {
    if (!this.selectedClassement?.classements?.length) return 0;
    return Math.max(...this.selectedClassement.classements.map(c => c.butsMarques), 0);
  }

  getBestDefense(): number {
    if (!this.selectedClassement?.classements?.length) return 0;
    return Math.min(...this.selectedClassement.classements.map(c => c.butsEncaisses));
  }

  getTotalGoals(): number {
    if (!this.selectedClassement?.classements?.length) return 0;
    return this.selectedClassement.classements.reduce((sum, c) => sum + c.butsMarques, 0);
  }
}
