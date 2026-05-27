export interface Event {
  id: string;
  nom: string;
  description?: string;
  dateDebut: string; // YYYY-MM-DD
  dateFin: string; // YYYY-MM-DD
  type: 'LEAGUE' | 'FRIENDLY';
  sportId: string;
  teamsIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type EventType = Event['type'];

export interface EventRequest {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  type: EventType;
  sportId: string;
  teamsIds: string[];
}
