import { ApiProperty } from '@nestjs/swagger';

export class NotificationReadSuccessResponse {
  @ApiProperty({
    description: '알림 읽음 여부',
    example: 'true',
    required: true,
  })
  isRead: boolean;
}
