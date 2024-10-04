import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationRecentListResponse } from './dto/notification-recent-list-response';
import { GetAuthUserGuard } from 'src/auth/guard/get-auth-user.guard';
import { User } from 'src/auth/user.decorator';
import { Types } from 'mongoose';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';
import { NotificationReadSuccessResponse } from './dto/notification-read-success-response';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: '내 알림 조회' })
  @ApiOkResponse({
    type: [NotificationRecentListResponse],
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(GetAuthUserGuard)
  async getRecentNotifications(@User('_id') userId: string | null): Promise<NotificationRecentListResponse[]> {
    return await this.notificationsService.getRecentNotifications(new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiOkResponse({
    type: NotificationReadSuccessResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id/read')
  async readNotification(@User('_id') userId: string, @Param('id', ParseObjectIdPipe) notificationId: Types.ObjectId) {
    const isRead: boolean = await this.notificationsService.readNotification(notificationId);
    return isRead;
  }

  @ApiOperation({ summary: '알림 전체 읽음 처리' })
  @ApiOkResponse({
    type: NotificationReadSuccessResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch('read-all')
  async readAllNotifications(@User('_id') userId: string) {
    const isRead: boolean = await this.notificationsService.readAllNotifications(new Types.ObjectId(userId));
    return isRead;
  }
}
