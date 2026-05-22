import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { GameService } from './game.service.js';
import { SessionService } from '../session/session.service.js';
import { MessageKeyResponseDto } from './dto/message-key-response.dto.js';
import { ThemeClickResponseDto } from './dto/theme-click-response.dto.js';
import { SessionResponseDto } from './dto/session-response.dto.js';

const COOKIE_NAME = 'rick_session';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24; // 24h

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly sessionService: SessionService,
  ) {}

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress ?? '0.0.0.0';
  }

  private resolveSession(req: Request, res: Response) {
    const sessionId = req.cookies?.[COOKIE_NAME] as string | undefined;
    const ip = this.getClientIp(req);
    const session = this.sessionService.getOrCreate(sessionId, ip);

    if (session.id !== sessionId) {
      res.cookie(COOKIE_NAME, session.id, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
      });
    }

    return session;
  }

  @Get('session')
  @ApiOperation({ summary: 'Get or create session', description: 'Returns the current session state. If none exists, creates a new one and sets the session cookie.' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  getSession(@Req() req: Request, @Res({ passthrough: true }) res: Response): SessionResponseDto {
    const session = this.resolveSession(req, res);
    return this.gameService.getSession(session);
  }

  @Post('vote')
  @ApiOperation({ summary: 'Vote for Rick', description: 'Returns a random vote quote key using a shuffle bag (no repeats until all are exhausted).' })
  @ApiResponse({ status: 201, type: MessageKeyResponseDto })
  vote(@Req() req: Request, @Res({ passthrough: true }) res: Response): MessageKeyResponseDto {
    const session = this.resolveSession(req, res);
    return this.gameService.vote(session);
  }

  @Post('theme-click')
  @ApiOperation({ summary: 'Theme button click', description: 'Processes a theme button click. Escalates through phases: insult (1-5), threat (6-10), warning (11-15), corrupt (16+). Returns the message key for the current phase.' })
  @ApiResponse({ status: 201, type: ThemeClickResponseDto })
  themeClick(@Req() req: Request, @Res({ passthrough: true }) res: Response): ThemeClickResponseDto {
    const session = this.resolveSession(req, res);
    return this.gameService.themeClick(session);
  }

  @Post('lang-switch')
  @ApiOperation({ summary: 'Switch language', description: 'Returns a random language-switch insult key. Resets all shuffle bags for the new language.' })
  @ApiResponse({ status: 201, type: MessageKeyResponseDto })
  langSwitch(@Req() req: Request, @Res({ passthrough: true }) res: Response): MessageKeyResponseDto {
    const session = this.resolveSession(req, res);
    return this.gameService.langInsult(session);
  }

  @Post('nuke')
  @ApiOperation({ summary: 'Activate Omega Device', description: 'Marks the session as nuked. State persists for the session lifetime.' })
  @ApiResponse({ status: 201, schema: { properties: { success: { type: 'boolean' } } } })
  nuke(@Req() req: Request, @Res({ passthrough: true }) res: Response): { success: boolean } {
    const session = this.resolveSession(req, res);
    return this.gameService.nuke(session);
  }
}
