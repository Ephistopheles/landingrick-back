import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ description: 'Session ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  sessionId!: string;

  @ApiProperty({ description: 'Whether the session has been nuked', example: false })
  isNuked!: boolean;

  @ApiProperty({ description: 'Number of theme button clicks', example: 3 })
  themeClicks!: number;
}
