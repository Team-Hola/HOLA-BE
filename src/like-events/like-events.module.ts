import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeEventsService } from './like-events.service';
import { LikeEvent, LikeEventSchema } from './schema/like-event.schema';
import { LikeEventsRepository } from './like-events.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: LikeEvent.name, schema: LikeEventSchema }])],
  providers: [LikeEventsService, LikeEventsRepository],
  exports: [LikeEventsService],
})
export class LikeEventsModule {}
