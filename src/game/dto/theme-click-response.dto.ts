import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ThemePhase = 'insult' | 'threat' | 'warning' | 'corrupt';

export class ThemeClickResponseDto {
  @ApiProperty({
    description: 'Theme button escalation phase',
    enum: ['insult', 'threat', 'warning', 'corrupt'],
    example: 'insult',
  })
  phase!: ThemePhase;

  @ApiPropertyOptional({
    description: 'i18n message collection key (absent in corrupt phase)',
    example: 'themeInsults',
  })
  key?: string;

  @ApiPropertyOptional({
    description: 'Message index within the collection (absent in corrupt phase)',
    example: 2,
  })
  index?: number;

  @ApiPropertyOptional({
    description: 'Pixelated user IP (only in threat phase)',
    example: '192.███.███.1',
  })
  pixelatedIp?: string;

  @ApiPropertyOptional({
    description: 'Raw user IP (only in corrupt phase)',
    example: '192.168.1.1',
  })
  ip?: string;
}
