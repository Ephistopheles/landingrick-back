export interface GameSession {
  id: string;
  themeClicks: number;
  isNuked: boolean;
  ip: string;
  shuffleBags: Record<string, number[]>;
}
