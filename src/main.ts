import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const whitelist = [
    'http://localhost:5200',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:3000',
    'http://159.223.53.82:3000',
  ];
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: function (origin, callback) {
      // console.log('origin', origin);

      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Comartek-elearning-api')
    .setDescription('Elearning platform')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/explorer', app, document);

  // Export api definition
  const codegenDir = __dirname + '/../codegen';
  if (!fs.existsSync(codegenDir)) {
    fs.mkdirSync(codegenDir);
  }
  fs.writeFileSync(__dirname + '/../codegen/api.json', JSON.stringify(document, null, 2));
  await app.listen(3000);
}
bootstrap();
