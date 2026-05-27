import { Component, input, output, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event, EventRequest, EventType } from '../../models/event.model';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="form-container" style="max-width: 900px; width: 100%; border: 1px solid #d9e2ef; box-shadow: 0 20px 50px rgba(16, 32, 51, 0.18);">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <h2 class="text-2xl font-bold text-gray-900" style="margin-bottom: 0.35rem;">
                {{ isEditMode() ? '✏️ Modifier l\'événement' : '✨ Créer un nouvel événement' }}
              </h2>
              <p class="text-sm" style="color:#5b6b7e; margin: 0;">
                Renseigne les informations principales puis valide pour enregistrer.
              </p>
            </div>
            <button type="button" (click)="onCancel()" class="btn-secondary" style="padding: 0.45rem 0.8rem;">✕</button>
          </div>

          @if (error()) {
            <div class="mb-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg" style="font-weight: 600;">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="dashboard-card" style="padding: 1rem; border-radius: 14px; background: #ffffff;">
              <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.85rem; color: #20324a;">Informations générales</h3>
              <div class="form-group required">
                <label style="font-weight: 700; color: #20324a;">📝 Nom de l'événement (3-100 caractères)</label>
                <div class="input-with-icon">
                  <span class="input-icon">🏷️</span>
                  <input
                    class="input-field"
                    type="text"
                    [(ngModel)]="formData.nom"
                    (blur)="validateField('nom')"
                    name="nom"
                    required
                    minlength="3"
                    maxlength="100"
                    placeholder="Ex: Tournoi Régional Street League"
                  />
                </div>
                <div class="char-count">{{ (formData.nom || '').length }}/100</div>
                @if (fieldErrors()['nom']) {
                  <p class="form-error">{{ fieldErrors()['nom'] }}</p>
                }
              </div>

              <div class="form-group">
                <label style="font-weight: 700; color: #20324a;">📄 Description (max 500 caractères)</label>
                <textarea
                  class="input-field"
                  [(ngModel)]="formData.description"
                  (blur)="validateField('description')"
                  name="description"
                  rows="4"
                  maxlength="500"
                  placeholder="Décris le contexte de l'événement, les objectifs et les équipes concernées"
                ></textarea>
                <div class="char-count">{{ (formData.description || '').length }}/500</div>
                @if (fieldErrors()['description']) {
                  <p class="form-error">{{ fieldErrors()['description'] }}</p>
                }
              </div>
            </div>

            <div class="dashboard-card" style="padding: 1rem; border-radius: 14px; background: #ffffff;">
              <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.85rem; color: #20324a;">Planification et paramètres</h3>
              <div class="form-row">
                <div class="form-group required">
                  <label style="font-weight: 700; color: #20324a;">📅 Date de début</label>
                  <input
                    class="input-field"
                    type="date"
                    [(ngModel)]="formData.dateDebut"
                    (blur)="validateField('dateDebut')"
                    name="dateDebut"
                    required
                    [min]="minDate"
                    (change)="validateDates()"
                  />
                  @if (fieldErrors()['dateDebut']) {
                    <p class="form-error">{{ fieldErrors()['dateDebut'] }}</p>
                  }
                </div>
                <div class="form-group required">
                  <label style="font-weight: 700; color: #20324a;">🗓️ Date de fin</label>
                  <input
                    class="input-field"
                    type="date"
                    [(ngModel)]="formData.dateFin"
                    (blur)="validateField('dateFin')"
                    name="dateFin"
                    required
                    [min]="formData.dateDebut"
                    (change)="validateDates()"
                  />
                  @if (fieldErrors()['dateFin']) {
                    <p class="form-error">{{ fieldErrors()['dateFin'] }}</p>
                  }
                </div>
              </div>

              @if (dateError()) {
                <div class="bg-orange-50 border border-orange-300 text-orange-800 px-4 py-3 rounded-lg text-sm" style="font-weight: 600; margin-bottom: 0.9rem;">
                  {{ dateError() }}
                </div>
              }

              <div class="form-row">
                <div class="form-group required">
                  <label style="font-weight: 700; color: #20324a;">🏁 Type d'événement</label>
                  <select
                    class="input-field"
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
                <div class="form-group required">
                  <label style="font-weight: 700; color: #20324a;">⚽ ID du sport</label>
                  <div class="input-with-icon">
                    <span class="input-icon">🧭</span>
                    <input
                      class="input-field"
                      type="text"
                      [(ngModel)]="formData.sportId"
                      (blur)="validateField('sportId')"
                      name="sportId"
                      required
                      placeholder="Ex: football, basketball"
                    />
                  </div>
                  @if (fieldErrors()['sportId']) {
                    <p class="form-error">{{ fieldErrors()['sportId'] }}</p>
                  }
                </div>
              </div>
            </div>

            <div class="dashboard-card" style="padding: 1rem; border-radius: 14px; background: #ffffff;">
              <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.85rem; color: #20324a;">Équipes participantes</h3>
              <div class="form-group required" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: #20324a;">👥 IDs des équipes (minimum 2)</label>
                <div class="border-2 rounded-lg p-3 min-h-14 flex flex-wrap gap-2 items-start bg-gray-50" [class.border-green-400]="formData.teamsIds.length >= 2" [class.border-red-400]="formData.teamsIds.length < 2 && fieldErrors()['teamsIds']" [class.border-gray-300]="formData.teamsIds.length === 0 || !fieldErrors()['teamsIds']">
                  @for (team of formData.teamsIds; track $index) {
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium">
                      {{ team }}
                      <button
                        type="button"
                        (click)="removeTeam($index)"
                        class="cursor-pointer hover:text-red-200 font-bold text-lg leading-none"
                        aria-label="Retirer équipe"
                      >
                        ×
                      </button>
                    </span>
                  }
                  <input
                    type="text"
                    #teamInput
                    (keyup.enter)="addTeam(teamInput.value); teamInput.value = ''"
                    placeholder="Ajouter un ID équipe puis Entrée"
                    class="flex-1 outline-none min-w-48 bg-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div class="form-help">
                  {{ formData.teamsIds.length }} équipe(s) ajoutée(s)
                  @if (formData.teamsIds.length < 2) {
                    <span class="text-red-600 font-semibold">(minimum requis: 2)</span>
                  }
                </div>
                @if (fieldErrors()['teamsIds']) {
                  <p class="form-error">{{ fieldErrors()['teamsIds'] }}</p>
                }
              </div>
            </div>

            <div class="button-group" style="margin-top: 1.5rem; gap: 0.8rem; justify-content: flex-end;">
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
                {{ loading() ? '⏳ Sauvegarde...' : '💾 Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: []
})
export class EventModalComponent {
  private eventService = inject(EventService);

  isOpen = input(false);
  event = input<Event | null>(null);
  close = output<void>();
  saved = output<void>();

  // Date validation
  minDate = this.getTodayDate();

  formData: EventRequest = {
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    type: 'LEAGUE' as EventType,
    sportId: '',
    teamsIds: []
  };

  loading = signal(false);
  error = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});
  dateError = signal<string | null>(null);
  isEditMode = signal(false);

  constructor() {
    effect(() => {
      const eventData = this.event();
      if (eventData) {
        this.formData = { ...eventData };
        this.isEditMode.set(true);
      } else {
        this.resetForm();
        this.isEditMode.set(false);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      type: 'LEAGUE',
      sportId: '',
      teamsIds: []
    };
    this.error.set(null);
    this.fieldErrors.set({});
    this.dateError.set(null);
  }

  validateDates(): void {
    const errors: Record<string, string> = { ...this.fieldErrors() };

    if (this.formData.dateDebut && this.formData.dateFin) {
      const startDate = new Date(this.formData.dateDebut);
      const endDate = new Date(this.formData.dateFin);

      if (endDate < startDate) {
        this.dateError.set('La date de fin doit être après ou égale à la date de début');
        errors['dateFin'] = 'La date de fin doit être après ou égale à la date de début';
      } else {
        this.dateError.set(null);
        delete errors['dateFin'];
      }

      // Check if start date is today or later
      const today = new Date(this.getTodayDate());
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        errors['dateDebut'] = 'La date de début ne peut pas être dans le passé';
      } else {
        delete errors['dateDebut'];
      }

      this.fieldErrors.set(errors);
    }
  }

  validateField(fieldName: string): void {
    const errors: Record<string, string> = { ...this.fieldErrors() };

    switch (fieldName) {
      case 'nom':
        if (!this.formData.nom || this.formData.nom.trim().length === 0) {
          errors['nom'] = 'Event name is required';
        } else if (this.formData.nom.length < 3) {
          errors['nom'] = 'Event name must be at least 3 characters';
        } else if (this.formData.nom.length > 100) {
          errors['nom'] = 'Event name cannot exceed 100 characters';
        } else {
          delete errors['nom'];
        }
        break;

      case 'description':
        if (this.formData.description && this.formData.description.length > 500) {
          errors['description'] = 'Description cannot exceed 500 characters';
        } else {
          delete errors['description'];
        }
        break;

      case 'sportId':
        if (!this.formData.sportId || this.formData.sportId.trim().length === 0) {
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
    if (!this.formData.nom?.trim() || 
        !this.formData.dateDebut || 
        !this.formData.dateFin || 
        !this.formData.type || 
        !this.formData.sportId?.trim()) {
      return false;
    }

    // Check field lengths
    if (this.formData.nom.length < 3 || this.formData.nom.length > 100) {
      return false;
    }

    if (this.formData.description && this.formData.description.length > 500) {
      return false;
    }

    // Check teams minimum
    if (this.formData.teamsIds.length < 2) {
      return false;
    }

    // Check date validation
    const startDate = new Date(this.formData.dateDebut);
    const endDate = new Date(this.formData.dateFin);

    if (endDate < startDate) {
      return false;
    }

    const today = new Date(this.getTodayDate());
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
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

  addTeam(teamId: string): void {
    const cleanId = teamId.trim();
    if (cleanId && !this.formData.teamsIds.includes(cleanId)) {
      this.formData.teamsIds.push(cleanId);
      // Clear team ID error if we now have minimum teams
      if (this.formData.teamsIds.length >= 2) {
        const errors = { ...this.fieldErrors() };
        delete errors['teamsIds'];
        this.fieldErrors.set(errors);
      }
    }
  }

  removeTeam(index: number): void {
    this.formData.teamsIds.splice(index, 1);
  }

  onSubmit(): void {
    this.validateDates();

    // Validate all fields
    this.validateField('nom');
    this.validateField('description');
    this.validateField('sportId');

    // Validate teams
    const errors: Record<string, string> = { ...this.fieldErrors() };
    if (this.formData.teamsIds.length < 2) {
      errors['teamsIds'] = 'At least 2 teams are required';
    } else {
      delete errors['teamsIds'];
    }
    this.fieldErrors.set(errors);

    if (!this.isFormValid()) {
      this.error.set('Please fix all errors before submitting');
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    const request = this.isEditMode()
      ? this.eventService.updateEvent(this.event()!.id, this.formData)
      : this.eventService.createEvent(this.formData);

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
          this.error.set(err.error?.message || 'Failed to save event');
        }
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }
}
