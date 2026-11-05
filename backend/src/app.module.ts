import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { GameEngineService } from './game-engine/game-engine.service';
import { EventProcessorService } from './event-processor/event-processor.service';
import { TikTokService } from './integrations/tiktok/tiktok.service';
import { ApiController } from './controllers/api.controller';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    EventProcessorService,
    TikTokService,
  ],
  exports: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    EventProcessorService,
    TikTokService,
  ],
})
export class AppModule {}

