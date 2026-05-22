import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { GameSession } from './session.interface.js';

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, GameSession>();

  create(ip: string): GameSession {
    const session: GameSession = {
      id: randomUUID(),
      themeClicks: 0,
      isNuked: false,
      ip,
      shuffleBags: {},
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): GameSession | undefined {
    return this.sessions.get(id);
  }

  getOrCreate(id: string | undefined, ip: string): GameSession {
    if (id) {
      const session = this.sessions.get(id);
      if (session) {
        session.ip = ip;
        return session;
      }
    }
    return this.create(ip);
  }

  getRandomIndex(session: GameSession, bagKey: string, totalItems: number): number {
    if (!session.shuffleBags[bagKey] || session.shuffleBags[bagKey].length === 0) {
      session.shuffleBags[bagKey] = Array.from({ length: totalItems }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
    }
    return session.shuffleBags[bagKey].pop()!;
  }

  resetBags(session: GameSession, keys: string[]): void {
    for (const key of keys) {
      delete session.shuffleBags[key];
    }
  }

  incrementThemeClicks(session: GameSession): number {
    session.themeClicks++;
    return session.themeClicks;
  }

  markNuked(session: GameSession): void {
    session.isNuked = true;
  }

  pixelateIP(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.███.███.${parts[3]}`;
    }
    return ip.slice(0, 3) + '█'.repeat(Math.max(0, ip.length - 5)) + ip.slice(-2);
  }
}
