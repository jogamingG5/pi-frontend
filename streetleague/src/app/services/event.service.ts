import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventRequest } from '../models/event.model';
import { API_BASE_URL, ENDPOINTS } from '../utils/constants';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = `${API_BASE_URL}${ENDPOINTS.EVENTS}`;

  constructor(private http: HttpClient) {}

  private mapEventFromApi(apiEvent: any): Event {
    const mapped = {
      id: apiEvent.id,
      nom: apiEvent.nomEvenement || apiEvent.nom || '',
      description: apiEvent.description || '',
      dateDebut: apiEvent.dateDebut || '',
      dateFin: apiEvent.dateFin || '',
      type: apiEvent.type || 'FRIENDLY',
      sportId: apiEvent.sportId || '',
      teamsIds: apiEvent.teamsIds || [],
      createdAt: apiEvent.createdAt,
      updatedAt: apiEvent.updatedAt
    };
    if (apiEvent.nomEvenement) {
      console.log('Mapped event:', mapped.nom);
    }
    return mapped;
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Handle both array and { value: [...] } formats
        const eventsArray = Array.isArray(response) ? response : (response.value || []);
        return eventsArray.map((event: any) => this.mapEventFromApi(event));
      })
    );
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(event => this.mapEventFromApi(event))
    );
  }

  createEvent(event: EventRequest): Observable<Event> {
    const apiEvent = {
      nomEvenement: event.nom,
      description: event.description,
      dateDebut: event.dateDebut,
      dateFin: event.dateFin,
      type: event.type,
      sportId: event.sportId,
      teamsIds: event.teamsIds
    };
    return this.http.post<any>(this.apiUrl, apiEvent).pipe(
      map(response => this.mapEventFromApi(response))
    );
  }

  updateEvent(id: string, event: Partial<EventRequest>): Observable<Event> {
    const apiEvent: any = {};
    if (event.nom) apiEvent.nomEvenement = event.nom;
    if (event.description !== undefined) apiEvent.description = event.description;
    if (event.dateDebut) apiEvent.dateDebut = event.dateDebut;
    if (event.dateFin) apiEvent.dateFin = event.dateFin;
    if (event.type) apiEvent.type = event.type;
    if (event.sportId) apiEvent.sportId = event.sportId;
    if (event.teamsIds) apiEvent.teamsIds = event.teamsIds;
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, apiEvent).pipe(
      map(response => this.mapEventFromApi(response))
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
