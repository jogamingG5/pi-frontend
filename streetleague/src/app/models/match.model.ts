export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  scoreTeam1: number;
  scoreTeam2: number;
  terrainId: string;
  date: string; // YYYY-MM-DD
  heure: string; // HH:mm
  sportId: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  type: 'LEAGUE' | 'FRIENDLY';
  createdAt?: string;
  updatedAt?: string;
}

export type MatchStatus = Match['status'];
export type MatchType = Match['type'];

export interface MatchRequest {
  team1Id: string;
  team2Id: string;
  scoreTeam1: number;
  scoreTeam2: number;
  terrainId: string;
  date: string;
  heure: string;
  sportId: string;
  status: MatchStatus;
  type: MatchType;
}
