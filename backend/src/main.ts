import './common/env';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('KnowledgeBattleServer');
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Phục vụ trực tiếp bản build Frontend (nếu có) để có thể chạy all-in-one trên cổng 4000
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    const httpAdapter = app.getHttpAdapter().getInstance();
    httpAdapter.use(express.static(frontendDist));
    httpAdapter.get(/^\/(?!api|socket\.io).*/, (_req: any, res: any) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 4100);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  logger.log(`Knowledge Battle Backend & Socket.IO Server running at http://localhost:${port}`);
}

bootstrap();
