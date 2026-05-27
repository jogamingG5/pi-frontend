// Feuilles de Match
export interface RecapEquipe {
  teamId: string;
  score: number;
  playerbookedYellowCards: string[];
  playerbookedRedCards: string[];
  nbCartesJaunes?: number;
  nbCartesRouges?: number;
}

export interface FeuillesDeMatch {
  id: string;
  matchId: string;
  recap: RecapEquipe[];
  dateMatch?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeuillesDeMatchRequest {
  matchId: string;
  recap: RecapEquipe[];
}

// Statistiques
export interface Statistiques {
  id: string;
  teamId: string;
  sportId: string;
  nbMatchsJoues: number;
  nbVictoires: number;
  nbDefaites: number;
  nbNuls: number;
  nbButsMarques: number;
  nbButsEncaisses: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatistiquesRequest {
  teamId: string;
  sportId: string;
  nbMatchsJoues?: number;
  nbVictoires?: number;
  nbDefaites?: number;
  nbNuls?: number;
  nbButsMarques?: number;
  nbButsEncaisses?: number;
}

// Classement
export interface ClassementEntry {
  teamId: string;
  teamName: string;
  rang: number;
  matchsJoues: number;
  victoires: number;
  defaites: number;
  nuls: number;
  pointsTotal: number;
  butsMarques: number;
  butsEncaisses: number;
  differenceButsGoal: number;
  tauxVictoire: number;
}

export interface Classement {
  id: string;
  eventId: string;
  sportId: string;
  classements: ClassementEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassementRequest {
  eventId: string;
  sportId: string;
  classements: ClassementEntry[];
}
