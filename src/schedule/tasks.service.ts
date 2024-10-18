import { AdvertisementsService } from './../advertisement/advertisements.service';
import { EventsService } from './../events/events.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly advertisementsService: AdvertisementsService,
  ) {}

  @Cron('0 0 * * *', {
    timeZone: 'Asia/Seoul', // 서울 타임존 설정
  })
  async handleCron() {
    await this.eventsService.updateClosedAfterEndDate();
    await this.advertisementsService.closeExpiredAds();
  }
}
