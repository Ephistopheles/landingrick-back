import { ApiProperty } from '@nestjs/swagger';

export class MessageKeyResponseDto {
  @ApiProperty({ description: 'i18n message collection key', example: 'voteQuotes' })
  key!: string;

  @ApiProperty({ description: 'Message index within the collection', example: 3 })
  index!: number;
}
