import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationListResponse } from './dto/notification-list-response';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { User } from 'src/auth/user.decorator';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';

@ApiTags('notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: '내 알림 조회' })
  @ApiOkResponse({
    type: [NotificationListResponse],
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('')
  async getNotificationList(@User('_id') userId: string): Promise<NotificationListResponse[]> {
    return await this.notificationsService.getNotificationList(new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id/read')
  async readNotification(@User('_id') userId: string, @Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.notificationsService.readNotification(id);
  }

  @ApiOperation({ summary: '알림 전체 읽음 처리' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch('read-all')
  async readAllNotification(@User('_id') userId: string, @Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.notificationsService.readAll(new Types.ObjectId(userId));
  }
}
