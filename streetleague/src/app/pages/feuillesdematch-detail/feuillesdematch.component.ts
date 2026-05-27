import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeuillesDeMatchService } from '../../services/statistiques.service';
import { FeuillesDeMatch, RecapEquipe } from '../../models/statistiques.model';

@Component({
  selector: 'app-feuillesdematch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feuillesdematch.component.html',
  styleUrls: ['./feuillesdematch.component.css']
})
export class FeuillesDeMatchComponent implements OnInit {
  feuillesDeMatch: FeuillesDeMatch[] = [];
  selectedFeuille: FeuillesDeMatch | null = null;
  matchId: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private feuillesDeMatchService: FeuillesDeMatchService) {}

  ngOnInit(): void {
    this.loadAllFeuillesDeMatch();
  }

  loadAllFeuillesDeMatch(): void {
    this.loading = true;
    this.error = '';
    this.feuillesDeMatchService.getAll().subscribe({
      next: (data) => {
        this.feuillesDeMatch = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des feuilles de match';
        console.error(err);
        this.loading = false;
      }
    });
  }

  searchByMatchId(): void {
    if (!this.matchId) {
      this.error = 'Veuillez remplir l\'ID du match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.feuillesDeMatchService.getByMatchId(this.matchId).subscribe({
      next: (data) => {
        this.selectedFeuille = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Feuille de match non trouvée pour cet ID';
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectFeuille(feuille: FeuillesDeMatch): void {
    this.selectedFeuille = feuille;
  }

  getTeamScore(teamId: string): number {
    if (!this.selectedFeuille) return 0;
    const team = this.selectedFeuille.recap?.find((e: RecapEquipe) => e.teamId === teamId);
    return team?.score || 0;
  }

  getTeamYellowCards(teamId: string): number {
    if (!this.selectedFeuille) return 0;
    const team = this.selectedFeuille.recap?.find((e: RecapEquipe) => e.teamId === teamId);
    return team?.nbCartesJaunes || team?.playerbookedYellowCards?.length || 0;
  }

  getTeamRedCards(teamId: string): number {
    if (!this.selectedFeuille) return 0;
    const team = this.selectedFeuille.recap?.find((e: RecapEquipe) => e.teamId === teamId);
    return team?.nbCartesRouges || team?.playerbookedRedCards?.length || 0;
  }

  deleteFeuille(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette feuille de match ?')) {
      this.feuillesDeMatchService.delete(id).subscribe({
        next: () => {
          this.feuillesDeMatch = this.feuillesDeMatch.filter(f => f.id !== id);
          this.selectedFeuille = null;
          this.error = '';
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  exportToPDF(): void {
    if (!this.selectedFeuille) return;
    // Implementation pour exporter en PDF
    console.log('Export PDF de la feuille de match:', this.selectedFeuille.id);
  }
}
