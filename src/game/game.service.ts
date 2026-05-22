import { Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service.js';
import type { GameSession } from '../session/session.interface.js';
import type { MessageKeyResponseDto } from './dto/message-key-response.dto.js';
import type { ThemeClickResponseDto } from './dto/theme-click-response.dto.js';
import type { SessionResponseDto } from './dto/session-response.dto.js';
import { MESSAGE_SIZES } from './constants.js';

@Injectable()
export class GameService {
  constructor(private readonly sessionService: SessionService) {}

  getSession(session: GameSession): SessionResponseDto {
    return {
      sessionId: session.id,
      isNuked: session.isNuked,
      themeClicks: session.themeClicks,
    };
  }

  vote(session: GameSession): MessageKeyResponseDto {
    const index = this.sessionService.getRandomIndex(session, 'voteQuotes', MESSAGE_SIZES.voteQuotes);
    return { key: 'voteQuotes', index };
  }

  themeClick(session: GameSession): ThemeClickResponseDto {
    const clicks = this.sessionService.incrementThemeClicks(session);

    if (clicks <= 5) {
      const index = this.sessionService.getRandomIndex(session, 'themeInsults', MESSAGE_SIZES.themeInsults);
      return { phase: 'insult', key: 'themeInsults', index };
    }

    if (clicks <= 10) {
      const index = this.sessionService.getRandomIndex(session, 'themeThreats', MESSAGE_SIZES.themeThreats);
      const pixelatedIp = this.sessionService.pixelateIP(session.ip);
      return { phase: 'threat', key: 'themeThreats', index, pixelatedIp };
    }

    if (clicks <= 15) {
      const index = this.sessionService.getRandomIndex(session, 'themeWarnings', MESSAGE_SIZES.themeWarnings);
      return { phase: 'warning', key: 'themeWarnings', index };
    }

    return { phase: 'corrupt', ip: session.ip };
  }

  langInsult(session: GameSession): MessageKeyResponseDto {
    this.sessionService.resetBags(session, [
      'voteQuotes',
      'themeInsults',
      'themeThreats',
      'themeWarnings',
      'langInsults',
    ]);
    const index = this.sessionService.getRandomIndex(session, 'langInsults', MESSAGE_SIZES.langInsults);
    return { key: 'langInsults', index };
  }

  nuke(session: GameSession): { success: boolean } {
    this.sessionService.markNuked(session);
    return { success: true };
  }
}
