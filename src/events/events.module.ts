import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/event.schema';
import { EventsRepository } from './events.repository';
import { LikeEventsModule } from 'src/like-events/like-events.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), JwtModule, LikeEventsModule],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  exports: [EventsService],
})
export class EventsModule {}
