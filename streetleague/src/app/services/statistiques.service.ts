import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FeuillesDeMatch,
  FeuillesDeMatchRequest,
  Statistiques,
  StatistiquesRequest,
  Classement,
  ClassementRequest,
  ClassementEntry
} from '../models/statistiques.model';

const API_BASE_URL = 'http://localhost:8081/streetleague/api';

@Injectable({ providedIn: 'root' })
export class FeuillesDeMatchService {
  private readonly apiUrl = `${API_BASE_URL}/feuillesDeMatch`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeuillesDeMatch[]> {
    return this.http.get<FeuillesDeMatch[]>(this.apiUrl);
  }

  getById(id: string): Observable<FeuillesDeMatch> {
    return this.http.get<FeuillesDeMatch>(`${this.apiUrl}/${id}`);
  }

  getByMatchId(matchId: string): Observable<FeuillesDeMatch> {
    return this.http.get<FeuillesDeMatch>(`${this.apiUrl}/match/${matchId}`);
  }

  create(request: FeuillesDeMatchRequest): Observable<FeuillesDeMatch> {
    return this.http.post<FeuillesDeMatch>(this.apiUrl, request);
  }

  update(id: string, request: FeuillesDeMatchRequest): Observable<FeuillesDeMatch> {
    return this.http.put<FeuillesDeMatch>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTeamScore(feuillesDeMatchId: string, teamId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${feuillesDeMatchId}/team/${teamId}/score`);
  }

  getTeamYellowCards(feuillesDeMatchId: string, teamId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${feuillesDeMatchId}/team/${teamId}/yellow-cards`);
  }

  getTeamRedCards(feuillesDeMatchId: string, teamId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${feuillesDeMatchId}/team/${teamId}/red-cards`);
  }
}

@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  private readonly apiUrl = `${API_BASE_URL}/statistiques`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Statistiques[]> {
    return this.http.get<Statistiques[]>(this.apiUrl);
  }

  getById(id: string): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/${id}`);
  }

  getByTeamAndSport(teamId: string, sportId: string): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/team/${teamId}/sport/${sportId}`);
  }

  getByTeam(teamId: string): Observable<Statistiques[]> {
    return this.http.get<Statistiques[]>(`${this.apiUrl}/team/${teamId}`);
  }

  getBySport(sportId: string): Observable<Statistiques[]> {
    return this.http.get<Statistiques[]>(`${this.apiUrl}/sport/${sportId}`);
  }

  create(request: StatistiquesRequest): Observable<Statistiques> {
    return this.http.post<Statistiques>(this.apiUrl, request);
  }

  update(id: string, request: StatistiquesRequest): Observable<Statistiques> {
    return this.http.put<Statistiques>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addVictoire(id: string, buts: number, butsEncaisses: number): Observable<Statistiques> {
    const params = new HttpParams()
      .set('buts', buts.toString())
      .set('butsEncaisses', butsEncaisses.toString());
    return this.http.put<Statistiques>(`${this.apiUrl}/${id}/victoire`, null, { params });
  }

  addDefaite(id: string, buts: number, butsEncaisses: number): Observable<Statistiques> {
    const params = new HttpParams()
      .set('buts', buts.toString())
      .set('butsEncaisses', butsEncaisses.toString());
    return this.http.put<Statistiques>(`${this.apiUrl}/${id}/defaite`, null, { params });
  }

  addNul(id: string, buts: number): Observable<Statistiques> {
    const params = new HttpParams().set('buts', buts.toString());
    return this.http.put<Statistiques>(`${this.apiUrl}/${id}/nul`, null, { params });
  }
}

@Injectable({ providedIn: 'root' })
export class ClassementService {
  private readonly apiUrl = `${API_BASE_URL}/classement`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Classement[]> {
    return this.http.get<Classement[]>(this.apiUrl);
  }

  getById(id: string): Observable<Classement> {
    return this.http.get<Classement>(`${this.apiUrl}/${id}`);
  }

  getByEventId(eventId: string): Observable<Classement> {
    return this.http.get<Classement>(`${this.apiUrl}/event/${eventId}`);
  }

  getBySportId(sportId: string): Observable<Classement> {
    return this.http.get<Classement>(`${this.apiUrl}/sport/${sportId}`);
  }

  getByEventIdAndSportId(eventId: string, sportId: string): Observable<Classement> {
    return this.http.get<Classement>(`${this.apiUrl}/event/${eventId}/sport/${sportId}`);
  }

  getBySportIdOrdered(sportId: string): Observable<Classement[]> {
    return this.http.get<Classement[]>(`${this.apiUrl}/sport/${sportId}/ordered`);
  }

  create(request: ClassementRequest): Observable<Classement> {
    return this.http.post<Classement>(this.apiUrl, request);
  }

  update(id: string, request: ClassementRequest): Observable<Classement> {
    return this.http.put<Classement>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generate(eventId: string, sportId: string, teamIds: string[]): Observable<Classement> {
    const params = new HttpParams()
      .set('eventId', eventId)
      .set('sportId', sportId)
      .set('teamIds', teamIds.join(','));
    return this.http.post<Classement>(`${this.apiUrl}/generate`, null, { params });
  }

  getTeamPosition(classementId: string, teamId: string): Observable<ClassementEntry> {
    return this.http.get<ClassementEntry>(`${this.apiUrl}/${classementId}/team/${teamId}/position`);
  }
}
