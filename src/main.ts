import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NovelCronJobService } from './schedule/novel-cron-job';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const whitelist = [
    'http://localhost:5200',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:4000',
    'http://localhost:3000',
    'http://159.223.53.82:3000',
    'https://light-novel-pub-murex.vercel.app',
    'https://novel-cool.vercel.app',
    'https://novelcoolbo.vercel.app',
      'https://www.readfullnovels.net',
      'https://readfullnovels.net',
      'https://latestnovels.net',
      'https://allfreenovels.net'
  ];
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.enableCors({
    origin: function (origin, callback) {
      console.log('origin', origin);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  app.use(cookieParser());
  const novel = app.get(NovelCronJobService);
  novel.crawlNovel();

  const config = new DocumentBuilder()
    .setTitle('Novel Api')
    .setDescription('Anime Novel')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/explorer', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
