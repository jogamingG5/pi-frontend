import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatistiquesService } from '../../services/statistiques.service';
import { Statistiques } from '../../models/statistiques.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  statistiques: Statistiques[] = [];
  selectedStatistiques: Statistiques | null = null;
  teamId: string = '';
  sportId: string = '';
  loading: boolean = false;
  error: string = '';
  filterBy: 'all' | 'team' | 'sport' = 'all';

  constructor(
    private statistiquesService: StatistiquesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllStatistiques();
  }

  loadAllStatistiques(): void {
    this.loading = true;
    this.error = '';
    this.statistiquesService.getAll().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.statistiques = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques';
        console.error(err);
      }
    });
  }

  searchByTeamAndSport(): void {
    if (!this.teamId || !this.sportId) {
      this.error = 'Veuillez remplir l\'équipe et le sport';
      return;
    }

    this.loading = true;
    this.error = '';
    this.statistiquesService.getByTeamAndSport(this.teamId, this.sportId).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.selectedStatistiques = data;
      },
      error: (err) => {
        this.error = 'Statistiques non trouvées pour ces critères';
        console.error(err);
      }
    });
  }

  searchByTeam(): void {
    if (!this.teamId) {
      this.error = 'Veuillez remplir l\'équipe';
      return;
    }

    this.loading = true;
    this.error = '';
    this.statistiquesService.getByTeam(this.teamId).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.statistiques = data;
        if (data.length > 0) {
          this.selectedStatistiques = data[0];
        }
      },
      error: (err) => {
        this.error = 'Statistiques non trouvées pour cette équipe';
        console.error(err);
      }
    });
  }

  searchBySport(): void {
    if (!this.sportId) {
      this.error = 'Veuillez remplir le sport';
      return;
    }

    this.loading = true;
    this.error = '';
    this.statistiquesService.getBySport(this.sportId).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.statistiques = data;
        if (data.length > 0) {
          this.selectedStatistiques = data[0];
        }
      },
      error: (err) => {
        this.error = 'Statistiques non trouvées pour ce sport';
        console.error(err);
      }
    });
  }

  selectStatistiques(stats: Statistiques): void {
    this.selectedStatistiques = stats;
  }

  getPerformanceClass(taux: number): string {
    if (taux >= 70) return 'bg-green-100 text-green-800';
    if (taux >= 50) return 'bg-blue-100 text-blue-800';
    if (taux >= 30) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  getPerformanceIcon(taux: number): string {
    if (taux >= 70) return '⭐';
    if (taux >= 50) return '✓';
    return '✗';
  }

  getNbPointsTotal(stats: Statistiques): number {
    return stats.nbVictoires * 3 + stats.nbNuls;
  }

  getDifferenceButsGoal(stats: Statistiques): number {
    return stats.nbButsMarques - stats.nbButsEncaisses;
  }

  getTauxVictoire(stats: Statistiques): number {
    return stats.nbMatchsJoues > 0 ? (stats.nbVictoires / stats.nbMatchsJoues) * 100 : 0;
  }

  getMoyenneButsMarques(stats: Statistiques): number {
    return stats.nbMatchsJoues > 0 ? stats.nbButsMarques / stats.nbMatchsJoues : 0;
  }

  getMoyenneButsEncaisses(stats: Statistiques): number {
    return stats.nbMatchsJoues > 0 ? stats.nbButsEncaisses / stats.nbMatchsJoues : 0;
  }
}
