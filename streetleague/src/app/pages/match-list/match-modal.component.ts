import { Component, input, output, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../services/match.service';
import { Match, MatchRequest, MatchStatus, MatchType } from '../../models/match.model';

@Component({
  selector: 'app-match-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="form-container">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ isEditMode() ? 'Modifier le Match' : 'Créer un Nouveau Match' }}
          </h2>

          @if (error()) {
            <div class="mb-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Teams Row -->
            <div class="form-row">
              <div class="form-group required">
                <label>ID de l'Équipe 1</label>
                <input
                  type="text"
                  [(ngModel)]="formData.team1Id"
                  (blur)="validateField('team1Id')"
                  name="team1Id"
                  required
                  minlength="1"
                  placeholder="Ex: team-001"
                />
                @if (fieldErrors()['team1Id']) {
                  <p class="form-error">{{ fieldErrors()['team1Id'] }}</p>
                }
              </div>
              <div class="form-group required">
                <label>ID de l'Équipe 2 (doit être différente)</label>
                <input
                  type="text"
                  [(ngModel)]="formData.team2Id"
                  (blur)="validateField('team2Id')"
                  name="team2Id"
                  required
                  minlength="1"
                  placeholder="Ex: team-002"
                />
                @if (fieldErrors()['team2Id']) {
                  <p class="form-error">{{ fieldErrors()['team2Id'] }}</p>
                }
              </div>
            </div>

            <!-- Scores Row -->
            <div class="form-row">
              <div class="form-group">
                <label>Score de l'Équipe 1 (≥ 0)</label>
                <input
                  type="number"
                  [(ngModel)]="formData.scoreTeam1"
                  (blur)="validateField('scoreTeam1')"
                  name="scoreTeam1"
                  min="0"
                  placeholder="0"
                />
                @if (fieldErrors()['scoreTeam1']) {
                  <p class="form-error">{{ fieldErrors()['scoreTeam1'] }}</p>
                }
              </div>
              <div class="form-group">
                <label>Score de l'Équipe 2 (≥ 0)</label>
                <input
                  type="number"
                  [(ngModel)]="formData.scoreTeam2"
                  (blur)="validateField('scoreTeam2')"
                  name="scoreTeam2"
                  min="0"
                  placeholder="0"
                />
                @if (fieldErrors()['scoreTeam2']) {
                  <p class="form-error">{{ fieldErrors()['scoreTeam2'] }}</p>
                }
              </div>
            </div>

            <!-- Terrain -->
            <div class="form-group required">
              <label>ID du Terrain</label>
              <input
                type="text"
                [(ngModel)]="formData.terrainId"
                (blur)="validateField('terrainId')"
                name="terrainId"
                required
                minlength="1"
                placeholder="Ex: terrain-001"
              />
              @if (fieldErrors()['terrainId']) {
                <p class="form-error">{{ fieldErrors()['terrainId'] }}</p>
              }
            </div>

            <!-- Date and Time Row -->
            <div class="form-row">
              <div class="form-group required">
                <label>Date du Match (aujourd'hui ou plus tard)</label>
                <input
                  type="date"
                  [(ngModel)]="formData.date"
                  (blur)="validateField('date')"
                  name="date"
                  required
                  [min]="minDate"
                />
                @if (fieldErrors()['date']) {
                  <p class="form-error">{{ fieldErrors()['date'] }}</p>
                }
              </div>
              <div class="form-group required">
                <label>Heure du Match (HH:mm)</label>
                <input
                  type="time"
                  [(ngModel)]="formData.heure"
                  (blur)="validateField('heure')"
                  name="heure"
                  required
                />
                @if (fieldErrors()['heure']) {
                  <p class="form-error">{{ fieldErrors()['heure'] }}</p>
                }
              </div>
            </div>

            <!-- Sport and Status Row -->
            <div class="form-row">
              <div class="form-group required">
                <label>ID du Sport</label>
                <input
                  type="text"
                  [(ngModel)]="formData.sportId"
                  (blur)="validateField('sportId')"
                  name="sportId"
                  required
                  minlength="1"
                  placeholder="Ex: football"
                />
                @if (fieldErrors()['sportId']) {
                  <p class="form-error">{{ fieldErrors()['sportId'] }}</p>
                }
              </div>
              <div class="form-group required">
                <label>Statut du Match</label>
                <select
                  [(ngModel)]="formData.status"
                  name="status"
                  required
                >
                  <option value="">Sélectionnez un statut</option>
                  <option value="SCHEDULED">PLANIFIÉ</option>
                  <option value="ONGOING">EN COURS</option>
                  <option value="COMPLETED">TERMINÉ</option>
                  <option value="CANCELLED">ANNULÉ</option>
                </select>
                @if (fieldErrors()['status']) {
                  <p class="form-error">{{ fieldErrors()['status'] }}</p>
                }
              </div>
            </div>

            <!-- Type -->
            <div class="form-group required">
              <label>Type de Match</label>
              <select
                [(ngModel)]="formData.type"
                name="type"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="LEAGUE">LIGUE</option>
                <option value="FRIENDLY">AMICAL</option>
              </select>
              @if (fieldErrors()['type']) {
                <p class="form-error">{{ fieldErrors()['type'] }}</p>
              }
            </div>

            <!-- Buttons -->
            <div class="button-group" style="margin-top: 2rem; gap: 1rem;">
              <button
                type="button"
                (click)="onCancel()"
                class="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="loading() || !isFormValid()"
                class="btn-primary"
              >
                {{ loading() ? 'Sauvegarde...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: []
})
export class MatchModalComponent {
  private matchService = inject(MatchService);

  isOpen = input(false);
  match = input<Match | null>(null);
  close = output<void>();
  saved = output<void>();

  // Date validation
  minDate = this.getTodayDate();

  form = signal<MatchRequest>({
    team1Id: '',
    team2Id: '',
    scoreTeam1: 0,
    scoreTeam2: 0,
    terrainId: '',
    date: '',
    heure: '',
    sportId: '',
    status: 'SCHEDULED' as MatchStatus,
    type: 'LEAGUE' as MatchType
  });

  loading = signal(false);
  error = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});
  isEditMode = signal(false);

  // Simpler form reference for template
  formData = {
    team1Id: '',
    team2Id: '',
    scoreTeam1: 0,
    scoreTeam2: 0,
    terrainId: '',
    date: '',
    heure: '',
    sportId: '',
    status: 'SCHEDULED' as MatchStatus,
    type: 'LEAGUE' as MatchType
  };

  constructor() {
    effect(() => {
      const matchData = this.match();
      if (matchData) {
        this.formData = { ...matchData };
        this.form.set(this.formData as any);
        this.isEditMode.set(true);
      } else {
        this.resetForm();
        this.isEditMode.set(false);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      team1Id: '',
      team2Id: '',
      scoreTeam1: 0,
      scoreTeam2: 0,
      terrainId: '',
      date: '',
      heure: '',
      sportId: '',
      status: 'SCHEDULED',
      type: 'LEAGUE'
    };
    this.form.set(this.formData);
    this.error.set(null);
    this.fieldErrors.set({});
  }

  validateField(fieldName: string): void {
    const errors: Record<string, string> = { ...this.fieldErrors() };

    switch (fieldName) {
      case 'team1Id':
        if (!this.formData.team1Id?.trim()) {
          errors['team1Id'] = 'Team 1 ID is required';
        } else if (this.formData.team1Id === this.formData.team2Id) {
          errors['team1Id'] = 'Team 1 ID cannot be the same as Team 2 ID';
        } else {
          delete errors['team1Id'];
        }
        break;

      case 'team2Id':
        if (!this.formData.team2Id?.trim()) {
          errors['team2Id'] = 'Team 2 ID is required';
        } else if (this.formData.team2Id === this.formData.team1Id) {
          errors['team2Id'] = 'Team 2 ID must differ from Team 1 ID';
        } else {
          delete errors['team2Id'];
        }
        break;

      case 'scoreTeam1':
        if (this.formData.scoreTeam1 < 0) {
          errors['scoreTeam1'] = 'Score cannot be negative';
        } else if (!Number.isInteger(this.formData.scoreTeam1)) {
          errors['scoreTeam1'] = 'Score must be an integer';
        } else {
          delete errors['scoreTeam1'];
        }
        break;

      case 'scoreTeam2':
        if (this.formData.scoreTeam2 < 0) {
          errors['scoreTeam2'] = 'Score cannot be negative';
        } else if (!Number.isInteger(this.formData.scoreTeam2)) {
          errors['scoreTeam2'] = 'Score must be an integer';
        } else {
          delete errors['scoreTeam2'];
        }
        break;

      case 'terrainId':
        if (!this.formData.terrainId?.trim()) {
          errors['terrainId'] = 'Terrain ID is required';
        } else {
          delete errors['terrainId'];
        }
        break;

      case 'date':
        if (!this.formData.date) {
          errors['date'] = 'Date is required';
        } else {
          const today = new Date(this.getTodayDate());
          const selectedDate = new Date(this.formData.date);
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            errors['date'] = 'Date cannot be in the past';
          } else {
            delete errors['date'];
          }
        }
        break;

      case 'heure':
        if (!this.formData.heure) {
          errors['heure'] = 'Time is required';
        } else if (!/^\d{2}:\d{2}$/.test(this.formData.heure)) {
          errors['heure'] = 'Time format must be HH:mm';
        } else {
          delete errors['heure'];
        }
        break;

      case 'sportId':
        if (!this.formData.sportId?.trim()) {
          errors['sportId'] = 'Sport ID is required';
        } else {
          delete errors['sportId'];
        }
        break;
    }

    this.fieldErrors.set(errors);
  }

  isFormValid(): boolean {
    // Check required fields
    if (!this.formData.team1Id?.trim() || 
        !this.formData.team2Id?.trim() || 
        !this.formData.terrainId?.trim() || 
        !this.formData.date || 
        !this.formData.heure || 
        !this.formData.sportId?.trim() ||
        !this.formData.status ||
        !this.formData.type) {
      return false;
    }

    // Check team IDs are different
    if (this.formData.team1Id === this.formData.team2Id) {
      return false;
    }

    // Check scores
    if (this.formData.scoreTeam1 < 0 || this.formData.scoreTeam2 < 0) {
      return false;
    }

    if (!Number.isInteger(this.formData.scoreTeam1) || !Number.isInteger(this.formData.scoreTeam2)) {
      return false;
    }

    // Check date
    const today = new Date(this.getTodayDate());
    const selectedDate = new Date(this.formData.date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return false;
    }

    // Check time format
    if (!/^\d{2}:\d{2}$/.test(this.formData.heure)) {
      return false;
    }

    return true;
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    this.error.set(null);
    this.fieldErrors.set({});

    // Validate all fields
    this.validateField('team1Id');
    this.validateField('team2Id');
    this.validateField('scoreTeam1');
    this.validateField('scoreTeam2');
    this.validateField('terrainId');
    this.validateField('date');
    this.validateField('heure');
    this.validateField('sportId');

    if (!this.isFormValid()) {
      this.error.set('Please fix all errors before submitting');
      return;
    }

    this.loading.set(true);

    const request = this.isEditMode()
      ? this.matchService.updateMatch(this.match()!.id, this.formData)
      : this.matchService.createMatch(this.formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.errors) {
          this.fieldErrors.set(err.error.errors);
          this.error.set('Please fix the errors above');
        } else {
          this.error.set(err.error?.message || 'Failed to save match');
        }
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }
}
