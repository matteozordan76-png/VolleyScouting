
export interface PlayerStats {
  rc: number;   // Ricezione OK
  re: number;   // Ricezione Errore
  bc: number;   // Battuta OK
  bs: number;   // Battuta Errore
  ace: number;  // Ace
  ae: number;   // Attacco Errore
  pt: number;   // Punto (Attacco/Altro)
}

export interface PlayerInfo {
  name: string;
  isAbsent: boolean;
}

export type SetHistory = Record<string, PlayerStats>;

export enum AppStep {
  ROSTER = 'ROSTER',
  SELECTION = 'SELECTION',
  GAME = 'GAME',
  SUMMARY = 'SUMMARY'
}
